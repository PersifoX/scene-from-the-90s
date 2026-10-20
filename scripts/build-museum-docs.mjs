import fs from "node:fs/promises";
import ts from "typescript";
import { CAMERA_VIEWS } from "../src/features/camera-navigation/model/navigation.mjs";
const input = await fs.readFile(
  "src/entities/interior/model/museum.ts",
  "utf8",
);
const compiled = ts.transpileModule(input, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const { sources, exhibits, films, radioTracks, tour } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
for (const exhibit of Object.values(exhibits))
  for (const id of exhibit.sources)
    if (!sources[id]) throw Error(`Missing source: ${id}`);
for (const step of tour) {
  if (!CAMERA_VIEWS[step.view])
    throw Error(`Missing camera view: ${step.view}`);
  if (step.exhibit && !exhibits[step.exhibit])
    throw Error(`Missing exhibit: ${step.exhibit}`);
}
for (const film of films) await fs.access(`public/${film.file}`);
const link = (source) =>
  `<a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.title)}</a>`;
const media = [
  ...films.map((f) => ({
    title: `${f.title} (${f.year}), «${f.clip}» · ${f.duration}`,
    url: `https://rutube.ru/video/${f.id}/`,
    note: "Короткий фрагмент с официального канала «Мосфильма». Локальная копия MP4 воспроизводится на экране 3D-телевизора; ссылка ведёт на оригинальную публикацию.",
  })),
  ...radioTracks.map((t) => ({
    title: `${t.station}, ${t.title} (${t.year})`,
    url: sources[t.source].url,
    note: "Архивная запись. Датировка по каталогу; звук передаётся с сервера архива, не имитируется.",
  })),
];
const html = `<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Источники музея</title><style>body{margin:0;background:#eeeadf;color:#242b22;font:17px/1.6 system-ui,sans-serif}main{max-width:1050px;margin:auto;padding:45px 25px 80px}h1{font-size:38px;line-height:1.1}h2{font-size:25px;margin-top:40px}h3{font-size:20px;margin-bottom:8px}a{color:#365d47}article{padding:18px 0;border-bottom:1px solid #c8c8b8}p{margin:8px 0}small{display:block;color:#59604e}.links a{display:block;margin-top:6px}li{margin-bottom:12px}table{border-collapse:collapse;width:100%;font-size:15px}td,th{padding:12px;text-align:left;border:1px solid #b8beac;vertical-align:top}@media(max-width:650px){table,tbody,tr,td,th{display:block}thead{display:none}}@media print{body{background:white}main{padding:0}article{break-inside:avoid}a{color:inherit}}</style><main>
<h1>На чём основана экспозиция</h1><p>«Когда родители были маленькими» · проверено 15 октября 2026 года.</p><p><a href="./">Комната</a> · <a href="SCENARIO.html">Сценарий показа</a> · <a href="ASSET-CREDITS.txt">Источники 3D-моделей и текстур</a></p>
<h2>Как читать музей</h2><ul><li>Комната реконструирована по современным семейным фотографиям. Геометрия и текстуры передают её облик; дата снимка не доказывает возраст каждого предмета.</li><li>Это маршрут по двум десятилетиям, а не документальная фиксация одного вечера: кино и радио имеют собственные датировки.</li><li>Рецепт кутьи записан по домашнему воспоминанию: рис варили на воде без масла, добавляли мармелад, мёд и сахар; готовили к Пасхе. Точные пропорции не указаны. Компьютер описывается как часть обстановки; марка и точный год не установлены. На столе собраны блюда разных домашних праздников.</li><li>Три репродукции выбраны для экспозиции. Наличие именно этих изображений в исходной комнате и рейтинг самых частых картин СССР не подтверждены.</li><li>Официальные музейные карточки подтверждают авторство и даты картин; выставка «Уют старой квартиры» — практику украшения советского жилья репродукциями. Эти два утверждения не подменяют друг друга.</li></ul>
<h2>Экспонаты и факты</h2>${Object.entries(exhibits)
  .map(
    ([id, e]) =>
      `<article id="${id}"><small>${esc(e.era)}</small><h3>${esc(e.title)}</h3><p>${esc(e.description)}</p><p>${esc(e.detail)}</p><div class="links">${e.sources.length ? e.sources.map((id) => link(sources[id])).join("") : id === "computer" ? "<small>Источник: описание обстановки исходной комнаты.</small>" : "<small>Источник: записанный домашний рецепт.</small>"}</div></article>`,
  )
  .join("")}
<h2>Фильмы и радио</h2><p>Короткие кинофрагменты взяты из публикаций правообладателя и сохранены в MP4 со звуком без изменений содержания. Видео загружается с сервера музея; внешний плеер не используется. <a href="media/films/sources.json">Файлы, источники и контрольные суммы</a>. Аудио — оцифрованные исторические записи из каталогов «Старое Радио» и «Свидетель» (проекты аудиоархива); для него нужен доступ к серверам архивов. Записи не выдаются за современное вещание. По ссылкам можно открыть исходные публикации.</p>${media.map((m) => `<article><h3><a href="${m.url}" target="_blank" rel="noreferrer">${esc(m.title)}</a></h3><small>${esc(m.note)}</small></article>`).join("")}
<h2>Картины: файлы и происхождение</h2><p>Репродукции взяты из Wikimedia Commons. На страницах файлов указан статус public domain / PD-Art: плоские репродукции произведений, авторские права на которые истекли. Изображения сохранены целиком; для пиксельного вида уменьшается разрешение текстуры.</p><table><thead><tr><th>Работа</th><th>Исходный файл</th></tr></thead><tbody>
<tr><td>В. Боровиковский. Портрет М.И. Лопухиной. 1797</td><td><a href="https://commons.wikimedia.org/wiki/File:Borovikovsky_maria_Lopukhina.jpg">Wikimedia Commons · файл и лицензия</a></td></tr>
<tr><td>К. Брюллов. Всадница. 1832</td><td><a href="https://commons.wikimedia.org/wiki/File:Karl_Bryullov_(Bryullo)_-_%D0%92%D1%81%D0%B0%D0%B4%D0%BD%D0%B8%D1%86%D0%B0_-_Google_Art_Project.jpg">Google Art Project / Wikimedia Commons</a></td></tr>
<tr><td>В. Тропинин. Кружевница. 1823</td><td><a href="https://commons.wikimedia.org/wiki/File:Vasily_Tropinin_-_%D0%9A%D1%80%D1%83%D0%B6%D0%B5%D0%B2%D0%BD%D0%B8%D1%86%D0%B0_-_Google_Art_Project.jpg">Google Art Project / Wikimedia Commons</a></td></tr></tbody></table>
<h2>Что взято из задания</h2><p>Тема 3 требует виртуальный музей повседневности 1980–1990-х: интерьер, еда, радио, собственный зал семейных артефактов и материалы культового кино. Семейная комната объединяет эти разделы в один маршрут.</p><p>Рекомендованная литература: Наталия Лебина. «Пассажиры колбасного поезда». М.: НЛО, 2019; «Советская повседневность: нормы и аномалии». М.: НЛО, 2015. ${link(sources.lebina)}. Полные тексты книг не использованы для постраничной проверки; цитаты и номера страниц из них не выдумываются. Конкретные факты карточек подтверждаются указанными выше доступными источниками.</p>
<h2>Границы реконструкции</h2><p>3D-модели еды и техники — иллюстрации к экспонатам. Модель серого телевизора и корпус компьютера не атрибутированы как конкретные советские изделия. Люстра, стенка, диван, ковёр и стол повторяют доступные фотопризнаки с приблизительными размерами. Ранее созданные декоративные AI-портреты исключены из экспозиции и заменены реальными картинами. Селёдки в текущем меню и сцене нет.</p></main></html>`;
await fs.writeFile("public/SOURCES.html", html);
console.log(
  `Museum catalog: ${Object.keys(exhibits).length} exhibits, ${films.length} films, ${radioTracks.length} radio recordings, ${tour.length} stops.`,
);
