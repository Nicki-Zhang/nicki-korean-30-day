import assert from 'node:assert/strict';
import fs from 'node:fs';

const root='quality-fix/lesson-06-unlocked';
const required=[
  '390-course-catalog.jpg','390-lesson-home.jpg','390-builder.jpg','390-challenge-wrong.jpg','390-complete-first.jpg','390-complete-repeat.jpg',
  '768-builder.jpg','768-complete.jpg',
  '1440-course-catalog.jpg','1440-extended-formulas.jpg','1440-words.jpg','1440-complete.jpg'
];
const harness=fs.readFileSync('tests/lesson-06-visual-regression.html','utf8');
for(const marker of ['DOMContentLoaded','doc.fonts.ready','key text not rendered before timeout','near-blank ratio','near-monochrome screenshot','horizontal overflow','main card only','rendered undefined','screenshot width does not match CSS viewport × DPR'])assert.ok(harness.includes(marker),`Visual harness missing guard: ${marker}`);

const manifest=JSON.parse(fs.readFileSync(`${root}/SCREENSHOT_MANIFEST.json`,'utf8'));
const result=JSON.parse(fs.readFileSync(`${root}/VISUAL_TEST_RESULT.json`,'utf8'));
assert.equal(manifest.schemaVersion,2);
assert.equal(manifest.browser,'Google Chrome');
assert.equal(result.status,'PASS');
assert.deepEqual(manifest.screenshots.map(item=>item.file),required);
assert.equal(result.domResults.length,12);
assert.equal(result.imageResults.length,12);

const imageResults=new Map(result.imageResults.map(item=>[item.file,item]));
for(const item of manifest.screenshots){
  for(const field of ['capturedAt','url','title','readyState','innerWidth','innerHeight','devicePixelRatio','htmlScrollWidth','bodyScrollWidth','bodyScrollHeight','keySelector','keyText','keyRect','keyVisible','mainSelector','mainCardWidth','fontsStatus','visibleElements','overflowElements','characterWrapSuspects','undefinedFound','imageWidth','imageHeight','nonWhiteRatio','quantizedColors','dominantColorRatio','blankImage','pixelViewportMatch'])assert.notEqual(item[field],undefined,`${item.file} missing ${field}`);
  assert.equal(item.readyState,'complete');
  assert.equal(item.fontsStatus,'loaded');
  assert.equal(item.keyVisible,true);
  assert.ok(item.keyText.trim().length>0);
  assert.ok(item.keyRect.width>0&&item.keyRect.height>0);
  assert.ok(item.visibleElements>=20);
  assert.ok(item.htmlScrollWidth<=item.innerWidth+2,`${item.file} HTML overflow`);
  assert.ok(item.bodyScrollWidth<=item.innerWidth+2,`${item.file} body overflow`);
  assert.deepEqual(item.overflowElements,[],`${item.file} contains overflowing elements`);
  assert.deepEqual(item.characterWrapSuspects,[],`${item.file} contains character-by-character wrapping`);
  assert.equal(item.undefinedFound,false);
  assert.ok(item.mainCardWidth>=Math.min(300,item.innerWidth-40),`${item.file} main card is too narrow`);
  assert.equal(item.horizontalOverflow,false);
  assert.equal(item.blankImage,false);
  assert.equal(item.pixelViewportMatch,true);
  assert.ok(Math.abs(item.imageWidth-Math.round(item.innerWidth*item.devicePixelRatio))<=2,`${item.file} pixel width/viewport/DPR mismatch`);
  assert.ok(item.nonWhiteRatio>=0.02,`${item.file} is near blank`);
  assert.ok(item.quantizedColors>=16,`${item.file} is near monochrome`);
  assert.ok(item.dominantColorRatio<=0.985,`${item.file} is dominated by one color`);
  assert.deepEqual(imageResults.get(item.file),{file:item.file,imageWidth:item.imageWidth,imageHeight:item.imageHeight,nonWhiteRatio:item.nonWhiteRatio,quantizedColors:item.quantizedColors,dominantColorRatio:item.dominantColorRatio,blankImage:false});
  const path=`${root}/screenshots/${item.file}`,bytes=fs.readFileSync(path);
  assert.ok(bytes.length>15000,`${item.file} is suspiciously small`);
  assert.deepEqual([...bytes.subarray(0,3)],[0xff,0xd8,0xff],`${item.file} is not JPEG`);
}

for(const dom of result.domResults){
  assert.ok([390,768,1440].includes(dom.innerWidth));
  assert.ok(dom.htmlScrollWidth<=dom.innerWidth+2&&dom.bodyScrollWidth<=dom.innerWidth+2,`${dom.name} overflowed`);
  assert.ok(dom.mainCardWidth>=Math.min(300,dom.innerWidth-40),`${dom.name} main card is too narrow`);
  assert.ok(dom.visibleElements>=20);
  assert.equal(dom.horizontalOverflow,false);
  assert.equal(dom.fontsStatus,'loaded');
}
assert.ok(result.domResults.some(item=>item.name==='390 catalog'));
assert.ok(result.domResults.some(item=>item.name==='1440 words'));
console.log(`Validated ${required.length} real Chrome screenshots and ${result.domResults.length} real-DOM cases at 390/768/1440px with blank, monochrome, viewport, overflow, narrow-card, wrapping, font and key-text guards.`);
