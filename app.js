const fs = require("fs");
const Jimp = require("jimp");
const inquirer = require("inquirer");

const addTextWatermarkToImage = async function (inputFile, outputFile, text) {
  try {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const textData = {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    };
    image.print(font, 0, 0, textData, image.getWidth(), image.getHeight());

    const answerEffect = await inquirer.prompt([
      {
        name: "start",
        type: "input",
        message: "Do you want to add more effects ? y/n",
      },
    ]);

    if (answerEffect.start === "y") {
      moreEffectsApp(image, outputFile);
    } else {
      await image.quality(100).writeAsync(outputFile);
      console.log("Success! Your watermark has been added");
    }
  } catch (error) {
    console.log("Something went wrong... Try again!");
  }
};

const addImageWatermarkToImage = async function (
  inputFile,
  outputFile,
  watermarkFile
) {
  try {
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);
    const x = image.getWidth() / 2 - watermark.getWidth() / 2;
    const y = image.getHeight() / 2 - watermark.getHeight() / 2;
    image.composite(watermark, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.5,
    });

    const answerEffect = await inquirer.prompt([
      {
        name: "start",
        type: "input",
        message: "Do you want to add more effects ? y/n",
      },
    ]);

    if (answerEffect.start === "y") {
      moreEffectsApp(image, outputFile);
    } else {
      await image.quality(100).writeAsync(outputFile);
      console.log("Success! Your watermark has been added");
    }
  } catch (error) {
    console.log("Something went wrong... Try again!");
  }
};

const moreEffectsApp = async (image, outputImage) => {
  const options = await inquirer.prompt([
    {
      name: "imageEffect",
      type: "list",
      choices: [
        "Make image brighter",
        "Increase contrast",
        "Make image b&w",
        "Invert image",
      ],
    },
  ]);
  switch (options.imageEffect) {
    case "Make image brighter":
      const brighterValue = await inquirer.prompt([
        {
          name: "value",
          type: "input",
          message: "Insert value between -1 and 1",
        },
      ]);
      options.brighterValue = brighterValue.value;
      addBrighterToImage(image, outputImage, options.brighterValue);
      break;

    case "Increase contrast":
      const contrastValue = await inquirer.prompt([
        {
          name: "value",
          type: "input",
          message: "Insert value between -1 and 1",
        },
      ]);
      options.contrastValue = contrastValue.value;

      addContrastToImage(image, outputImage, options.contrastValue);
      break;

    case "Make image b&w":
      blackWhiteToImage(image, outputImage);
      break;

    case "Invert image":
      invertToImage(image, outputImage);
      break;
  }
};

const addBrighterToImage = async function (
  inputFile,
  outputFile,
  brighterValue
) {
  try {
    const image = await Jimp.read(inputFile);
    image.brightness(parseFloat(brighterValue));

    const answerEffect = await inquirer.prompt([
      {
        name: "start",
        type: "input",
        message: "Do you want to add more effects ? y/n",
      },
    ]);

    if (answerEffect.start === "y") {
      moreEffectsApp(image, outputFile);
    } else {
      await image.quality(100).writeAsync(outputFile);
      console.log(
        "Success! Your watermark has been added and your image has more effect"
      );
      startApp();
    }
  } catch (error) {
    console.log("Wrong value!");
  }
};

const addContrastToImage = async function (
  inputFile,
  outputFile,
  contrastValue
) {
  try {
    const image = await Jimp.read(inputFile);
    image.contrast(parseFloat(contrastValue));
    const answerEffect = await inquirer.prompt([
      {
        name: "start",
        type: "input",
        message: "Do you want to add more effects ? y/n",
      },
    ]);

    if (answerEffect.start === "y") {
      moreEffectsApp(image, outputFile);
    } else {
      await image.quality(100).writeAsync(outputFile);
      console.log(
        "Success! Your watermark has been added and your image has more effect"
      );
      startApp();
    }
  } catch (error) {
    console.log("Wrong value!");
  }
};

const blackWhiteToImage = async function (inputFile, outputFile) {
  try {
    const image = await Jimp.read(inputFile);
    image.greyscale();
    const answerEffect = await inquirer.prompt([
      {
        name: "start",
        type: "input",
        message: "Do you want to add more effects ? y/n",
      },
    ]);

    if (answerEffect.start === "y") {
      moreEffectsApp(image, outputFile);
    } else {
      await image.quality(100).writeAsync(outputFile);
      console.log(
        "Success! Your watermark has been added and your image has more effect"
      );
      startApp();
    }
  } catch (error) {
    console.log("Something went wrong... Try again!");
  }
};

const invertToImage = async function (inputFile, outputFile) {
  try {
    const image = await Jimp.read(inputFile);
    image.invert();
    const answerEffect = await inquirer.prompt([
      {
        name: "start",
        type: "input",
        message: "Do you want to add more effects ? y/n",
      },
    ]);

    if (answerEffect.start === "y") {
      moreEffectsApp(image, outputFile);
    } else {
      await image.quality(100).writeAsync(outputFile);
      console.log(
        "Success! Your watermark has been added and your image has more effect"
      );
      startApp();
    }
  } catch (error) {
    console.log("Something went wrong... Try again!");
  }
};

const prepareOutputFilename = (image) => {
  const [name, ext] = image.split(".");
  return `${name}-with-watermark.${ext}`;
};
const startApp = async () => {
  const answer = await inquirer.prompt([
    {
      name: "start",
      message:
        'Hi! Welcome to "watermark manager". Copy your image files to `/img` folder. Then you\'ll be able to use them in the app. Are you ready ?',
      type: "confirm",
    },
  ]);

  if (!answer.start) process.exit;

  const options = await inquirer.prompt([
    {
      name: "inputImage",
      type: "input",
      message: "What file do you want to mark?",
      default: "test.jpg",
    },
    {
      name: "watermarkType",
      type: "list",
      choices: ["Text watermark", "Image watermark"],
    },
  ]);

  if (options.watermarkType === "Text watermark") {
    const text = await inquirer.prompt([
      {
        name: "value",
        type: "input",
        message: "Type your watermark text: ",
      },
    ]);
    options.watermarkText = text.value;

    if (fs.existsSync(`./img/${options.inputImage}`)) {
      addTextWatermarkToImage(
        `./img/${options.inputImage}`,
        `./img/${prepareOutputFilename(options.inputImage)}`,
        options.watermarkText
      );
    } else {
      console.log("Something went wrong... Try again");
    }
  } else {
    const image = await inquirer.prompt([
      {
        name: "filename",
        type: "input",
        message: "Type your watermark name:",
        default: "logo.png",
      },
    ]);
    options.watermarkImage = image.filename;
    if (
      fs.existsSync(`./img/${options.inputImage}`) &&
      fs.existsSync(`./img/${options.watermarkImage}`)
    ) {
      addImageWatermarkToImage(
        `./img/${options.inputImage}`,
        `./img/${prepareOutputFilename(options.inputImage)}`,
        `./img/${options.watermarkImage}`
      );
    } else {
      console.log("Something went wrong... Try again");
    }
  }
};

startApp();
