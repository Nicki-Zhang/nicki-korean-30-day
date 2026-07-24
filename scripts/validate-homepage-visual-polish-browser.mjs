import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = process.env.NIKIGO_PREVIEW_URL || 'http://127.0.0.1:4204';
const CHROME = process.env.PLAYWRIGHT_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const EVIDENCE = path.join(ROOT, 'quality-fix/homepage-visual-polish-formal/evidence');
const RESULT_FILE = path.join(ROOT, 'quality-fix/homepage-visual-polish-formal/VALIDATION_RESULT.json');
const LANGUAGES = ['zh', 'en', 'vi', 'ja'];
const VIEWPORTS = [
  { width:390, height:844 },
  { width:430, height:932 },
  { width:768, height:1024 },
  { width:1440, height:1024 }
];

const baseProfile = {
  schemaVersion:4,
  name:'Nicki',
  avatar:'initial',
  interfaceLanguage:'zh',
  learningLanguage:'zh',
  time:'10',
  audioRate:1,
  autoplayAudio:false,
  hangulLevel:'beginner',
  hangulRecommendation:'',
  memberTier:'free',
  reviewItems:[],
  weeklyProgress:0,
  xp:0,
  streak:0
};

const states = {
  setup:{
    profile:{ ...baseProfile, path:'', completedLessons:[], lessonProgress:{} },
    sessions:{},
    expected:{ title:'完成学习设置', action:'开始设置', lesson:'学习设置', progress:0 }
  },
  active:{
    profile:{
      ...baseProfile,
      path:'K1',
      completedLessons:Array.from({ length:13 }, (_, index) => `lesson-${String(index).padStart(2, '0')}`),
      lessonProgress:{ 'lesson-13':40 },
      weeklyProgress:3,
      xp:600,
      streak:1
    },
    sessions:{ 'lesson-13':{ step:4, index:4, completed:false } },
    expected:{ title:'固有数词1～10与基础数量', action:'继续当前课程', lesson:'第13课', progress:40 }
  },
  partial:{
    profile:{
      ...baseProfile,
      path:'K0',
      completedLessons:Array.from({ length:5 }, (_, index) => `lesson-${String(index).padStart(2, '0')}`),
      lessonProgress:{ 'lesson-05':60 },
      weeklyProgress:2,
      xp:250,
      streak:5
    },
    sessions:{ 'lesson-05':{ step:5, index:5, completed:false } },
    expected:{ title:'看懂韩语音节块', action:'继续当前课程', lesson:'第5课', progress:60 }
  }
};

function localizedProfile(profile, language) {
  return { ...profile, interfaceLanguage:language, learningLanguage:language };
}

function screenshotName(state, viewport, language) {
  return `formal-${viewport.width}-${language}-${state}-final.png`;
}

function viewportScreenshotName(state, viewport, language) {
  return `formal-${viewport.width}-${language}-${state}-viewport-final.png`;
}

async function installState(context, stateName, language) {
  const fixture = states[stateName];
  await context.addInitScript(({ profile, sessions }) => {
    localStorage.setItem('nikigoCourseIdentityMigration:v1', 'done');
    localStorage.setItem('nikigoProfile', JSON.stringify(profile));
    for (let index = 0; index < 14; index += 1) {
      localStorage.removeItem(`nikigoLessonSession:lesson-${String(index).padStart(2, '0')}`);
    }
    Object.entries(sessions).forEach(([contentId, session]) => {
      localStorage.setItem(`nikigoLessonSession:${contentId}`, JSON.stringify(session));
    });
  }, {
    profile:localizedProfile(fixture.profile, language),
    sessions:fixture.sessions
  });
}

async function inspectPage(page, stateName, viewport, language) {
  const metrics = await page.evaluate(() => {
    const visible = element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && rect.width > 0
        && rect.height > 0
        && rect.bottom > 0
        && rect.top < innerHeight;
    };
    const rect = element => {
      const value = element.getBoundingClientRect();
      return { x:value.x, y:value.y, width:value.width, height:value.height, right:value.right, bottom:value.bottom };
    };
    const targetSelector = 'button,a,select,summary';
    const smallTargets = [...document.querySelectorAll(targetSelector)]
      .filter(visible)
      .map(element => ({ tag:element.tagName, text:element.innerText?.trim() || element.getAttribute('aria-label') || '', rect:rect(element) }))
      .filter(item => item.rect.width < 44 || item.rect.height < 44);
    const nodes = [...document.querySelectorAll('.learningLocator li')];
    const centers = nodes.map(node => {
      const nodeRect = node.querySelector('.locatorNode').getBoundingClientRect();
      return { x:nodeRect.x + nodeRect.width / 2, y:nodeRect.y + nodeRect.height / 2 };
    });
    const axisValues = innerWidth <= 899 ? centers.map(item => item.y) : centers.map(item => item.x);
    const axisError = Math.max(...axisValues) - Math.min(...axisValues);
    const language = document.querySelector('#language').getBoundingClientRect();
    const chevron = document.querySelector('.languageChevron').getBoundingClientRect();
    const navButtons = [...document.querySelectorAll('#appNav button')];
    return {
      url:location.href,
      lang:document.documentElement.lang,
      overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      pageHeight:document.documentElement.scrollHeight,
      nav:navButtons.map(button => ({
        target:button.dataset.target,
        text:button.innerText.trim(),
        current:button.getAttribute('aria-current'),
        icon:button.querySelector('svg[aria-hidden="true"]') !== null,
        rect:rect(button)
      })),
      mission:{
        title:document.querySelector('#missionTitle').textContent.trim(),
        action:document.querySelector('#primaryAction').textContent.trim(),
        korean:document.querySelector('#missionKorean').textContent.trim(),
        progress:Number(document.querySelector('#heroProgressTrack').getAttribute('aria-valuenow'))
      },
      locator:{
        labels:nodes.map(node => node.innerText.trim()),
        states:nodes.map(node => node.dataset.state),
        current:nodes.map(node => node.getAttribute('aria-current')),
        centers,
        axisError
      },
      chevron:{
        display:getComputedStyle(document.querySelector('.languageChevron')).display,
        rightInset:language.right - chevron.right,
        select:rect(document.querySelector('#language'))
      },
      smallTargets,
      primaryCount:[...document.querySelectorAll('.learningHero .primary')].filter(visible).length,
      hero:rect(document.querySelector('.learningHero')),
      welcome:rect(document.querySelector('.dashboardWelcome')),
      mobileNav:getComputedStyle(document.querySelector('#appNav')).position === 'fixed',
      reducedMotion:getComputedStyle(document.querySelector('.heroProgressTrack i')).transitionDuration
    };
  });

  assert.ok(metrics.overflow <= 0, `${stateName}/${viewport.width}/${language}: horizontal overflow ${metrics.overflow}`);
  assert.equal(metrics.nav.length, 5, `${stateName}/${viewport.width}/${language}: five navigation items required`);
  assert.deepEqual(metrics.nav.map(item => item.target), ['dashboard', 'courses', 'practice', 'progress', 'profile']);
  assert.equal(new Set(metrics.nav.map(item => item.target)).size, 5);
  assert.ok(metrics.nav.every(item => item.icon && item.text), `${stateName}/${viewport.width}/${language}: icon and text required`);
  assert.equal(metrics.nav.filter(item => item.current === 'page').length, 1);
  assert.equal(metrics.nav.find(item => item.current === 'page')?.target, 'dashboard');
  assert.equal(metrics.smallTargets.length, 0, `${stateName}/${viewport.width}/${language}: controls below 44px`);
  assert.ok(metrics.locator.axisError <= 1, `${stateName}/${viewport.width}/${language}: path axis error ${metrics.locator.axisError}`);
  assert.equal(metrics.locator.current.filter(value => value === 'step').length, 1);
  assert.equal(metrics.locator.states[2], 'current');
  assert.equal(metrics.primaryCount, 1);
  assert.equal(metrics.chevron.display, 'block');
  assert.ok(metrics.chevron.rightInset >= 16 && metrics.chevron.rightInset <= 20, `${stateName}/${viewport.width}/${language}: chevron inset ${metrics.chevron.rightInset}`);
  assert.equal(metrics.mobileNav, viewport.width <= 899);
  if (stateName === 'setup') {
    assert.deepEqual(metrics.locator.states, ['context', 'context', 'current']);
    assert.ok(!metrics.locator.states.includes('complete'));
  }
  if (language === 'zh') {
    const expected = states[stateName].expected;
    assert.equal(metrics.mission.title, expected.title);
    assert.equal(metrics.mission.action, expected.action);
    assert.equal(metrics.mission.progress, expected.progress);
    assert.ok(metrics.locator.labels[2].includes(expected.lesson));
    assert.ok(metrics.locator.labels[0].includes('阶段'));
    assert.ok(metrics.locator.labels[1].includes('模块'));
    assert.ok(!metrics.locator.labels.join(' ').includes('Stage'));
    assert.ok(!metrics.locator.labels.join(' ').includes('Module'));
  }
  return metrics;
}

await mkdir(EVIDENCE, { recursive:true });
const browser = await chromium.launch({ headless:true, executablePath:CHROME });
const results = [];
const consoleIssues = [];
const networkIssues = [];
const externalRequests = [];

try {
  for (const stateName of Object.keys(states)) {
    for (const viewport of VIEWPORTS) {
      for (const language of LANGUAGES) {
        if (stateName !== 'active' && (language !== 'zh' || viewport.width !== 390)) continue;
        const context = await browser.newContext({
          viewport,
          locale:language === 'zh' ? 'zh-CN' : language,
          reducedMotion:'reduce'
        });
        await installState(context, stateName, language);
        const page = await context.newPage();
        page.on('console', message => {
          if (['error', 'warning'].includes(message.type())) consoleIssues.push({ stateName, viewport, language, type:message.type(), text:message.text() });
        });
        page.on('requestfailed', request => networkIssues.push({ stateName, viewport, language, url:request.url(), error:request.failure()?.errorText }));
        page.on('request', request => {
          const url = new URL(request.url());
          if (!['127.0.0.1', 'localhost'].includes(url.hostname)) externalRequests.push(request.url());
        });
        await page.goto(`${BASE_URL}/nikigo-app.html?lang=${language}#dashboard`, { waitUntil:'networkidle' });
        await page.evaluate(() => scrollTo(0, 0));
        const metrics = await inspectPage(page, stateName, viewport, language);
        results.push({ state:stateName, viewport, language, ...metrics });

        const shouldCapture = (language === 'zh' && stateName === 'active')
          || (viewport.width === 390 && ['setup', 'partial'].includes(stateName))
          || (viewport.width === 390 && stateName === 'active');
        if (shouldCapture) {
          await page.screenshot({
            path:path.join(EVIDENCE, screenshotName(stateName, viewport, language)),
            fullPage:true
          });
          await page.screenshot({
            path:path.join(EVIDENCE, viewportScreenshotName(stateName, viewport, language)),
            fullPage:false
          });
        }
        await context.close();
      }
    }
  }

  const routeContext = await browser.newContext({ viewport:{ width:1440, height:1024 } });
  await installState(routeContext, 'active', 'zh');
  const routePage = await routeContext.newPage();
  await routePage.goto(`${BASE_URL}/nikigo-app.html?lang=zh#dashboard`, { waitUntil:'networkidle' });
  const routeResults = [];
  for (const target of ['courses', 'practice', 'progress', 'profile', 'dashboard']) {
    await routePage.locator(`#appNav button[data-target="${target}"]`).click();
    await routePage.waitForFunction(value => location.hash === `#${value}`, target);
    routeResults.push({
      target,
      hash:await routePage.evaluate(() => location.hash),
      current:await routePage.locator(`#appNav button[data-target="${target}"]`).getAttribute('aria-current')
    });
  }
  await routePage.goBack();
  await routePage.waitForLoadState('domcontentloaded');
  const historyHash = await routePage.evaluate(() => location.hash);
  await routePage.reload({ waitUntil:'networkidle' });
  const refreshedHash = await routePage.evaluate(() => location.hash);
  assert.equal(historyHash, '#profile');
  assert.equal(refreshedHash, '#profile');
  assert.ok(routeResults.every(item => item.hash === `#${item.target}` && item.current === 'page'));
  await routeContext.close();

  assert.equal(consoleIssues.length, 0, `Console issues: ${JSON.stringify(consoleIssues)}`);
  assert.equal(networkIssues.length, 0, `Network issues: ${JSON.stringify(networkIssues)}`);
  assert.equal(externalRequests.length, 0, `External requests: ${JSON.stringify(externalRequests)}`);

  const swSource = await readFile(path.join(ROOT, 'sw.js'), 'utf8');
  const assetsBlock = swSource.match(/const ASSETS = \[([\s\S]*?)\];/u)?.[1] || '';
  const serviceWorkerAssets = [...assetsBlock.matchAll(/'(\.\/[^']*)'/gu)].map(match => match[1]);
  const swResults = [];
  for (const asset of serviceWorkerAssets) {
    const response = await fetch(new URL(asset.slice(2), `${BASE_URL}/`));
    swResults.push({ asset, status:response.status });
  }
  assert.ok(swResults.every(item => item.status === 200), `Service Worker HTTP failures: ${JSON.stringify(swResults.filter(item => item.status !== 200))}`);

  const payload = {
    generatedAt:new Date().toISOString(),
    baseUrl:BASE_URL,
    baseline:'bccf01b622ddcc0af839ceadf7a28a4f5891e515',
    states:Object.keys(states),
    viewports:VIEWPORTS,
    languages:LANGUAGES,
    results,
    routeResults,
    history:{ back:historyHash, refresh:refreshedHash },
    serviceWorker:{ count:swResults.length, allHttp200:swResults.every(item => item.status === 200), assets:swResults },
    consoleIssues,
    networkIssues,
    externalRequests,
    apiRequests:0,
    fees:0
  };
  await writeFile(RESULT_FILE, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Validated ${results.length} Homepage Visual Polish formal browser states; ${swResults.length} Service Worker assets returned HTTP 200.`);
} finally {
  await browser.close();
}
