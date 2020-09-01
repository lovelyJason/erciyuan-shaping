const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  const { value, imgType } = event;
  try {
    const res = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: `image/${imgType}`,
        value: Buffer.from(value),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};
