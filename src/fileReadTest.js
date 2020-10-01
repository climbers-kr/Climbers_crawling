import { promises as fs } from 'fs';
import Gym from './models/gym';

const fileReadTest = async () => {
  try {
    const fileList = await fs.readdir('./Json');

    fileList.slice(0, 10).forEach(async file => {
      const data = await fs.readFile(`./Json/${file}`);
      const gymJson = JSON.parse(data);
      const {
        summary: {
          name,
          address,
          addressAbbr,
          phone,
          repKeywordList,
          coordinate,
          homepageList,
        },
        images: { imageList },
        bizHours: { bizHourList },
        menus: {menuList},
      } = gymJson;

      const gym = new Gym({
        name,
        address,
        addressAbbr,
        phone,
        imgUrlList: imageList.map(v => v.url),
        bizHour: bizHourList,
        prices: menuList,
        homepages: homepageList,
        keywords: repKeywordList,
        coordinate
      });

      //console.log(gym, 'gym test');

      //await gym.save();
    });

    
  } catch (e) {
    console.log('failed to read directory', e);
  }

};

export default fileReadTest;
