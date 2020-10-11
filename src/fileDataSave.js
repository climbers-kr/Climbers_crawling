import { promises as fs } from 'fs';
import Gym from './models/gym';

const fileDataSave = async () => {
  try {
    const fileList = await fs.readdir('./Json');

    fileList.forEach(async file => {
      const data = await fs.readFile(`./Json/${file}`);
      const gymJson = JSON.parse(data);
      const {
        summary: {
          name,
          address,
          addressAbbr,
          roadAddr,
          phone,
          repKeywordList,
          coordinate,
          homepageList,
          detailedDescription,
          id,
          road,
        },
        images: { imageList },
        bizHours: { bizHourList },
        menus: {menuList},
      } = gymJson;

      const gym = new Gym({
        dataId: id,
        name,
        address,
        addressAbbr,
        roadAddr,
        phone,
        imgUrlList: imageList.map(v => v.url),
        bizHour: bizHourList,
        prices: menuList,
        homepages: homepageList,
        keywords: repKeywordList,
        coordinate,
        detailedDescription,
        roadDescription: road,
      });

      //await gym.save();
    });

    
  } catch (e) {
    console.log('failed to read directory', e);
  }

};

export default fileDataSave;
