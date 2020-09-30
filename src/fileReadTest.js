import { promises as fs } from 'fs';

const fileReadTest = async () => {
  try {
    const fileList = await fs.readdir('./Json');

    fileList.slice(0, 10).forEach(async file => {
      const data = await fs.readFile(`./Json/${file}`);
      const centerJson = JSON.parse(data);
      const {
        summary: {
          name,
          address,
          addressAbbr,
        },
        images: { imageList },
        bizHours: { bizHourList }
      } = centerJson;
      console.log(name, imageList, address, addressAbbr, bizHourList)
    });
  } catch (e) {
    console.log('failed to read directory', e);
  }

};

export default fileReadTest;
