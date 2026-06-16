const prisma =
  require("../prisma/prismaClient");

const trackOpen =
async (req,res)=>{

  try{

    const logId =
      Number(
        req.params.logId
      );

    console.log(
      `EMAIL OPENED -> ${logId}`
    );

    await prisma.communicationLog.update({

      where:{
        id:logId
      },

      data:{
        status:"OPENED"
      }

    });

  }
  catch(error){

    console.error(
      error.message
    );

  }

  const pixel =
    Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      "base64"
    );

  res.set(
    "Content-Type",
    "image/gif"
  );

  res.send(pixel);

};

const trackClick =
async (req,res)=>{

  try{

    const logId =
      Number(
        req.params.logId
      );

    console.log(
      `EMAIL CLICKED -> ${logId}`
    );

    await prisma.communicationLog.update({

      where:{
        id:logId
      },

      data:{
        status:"CLICKED"
      }

    });

  }
  catch(error){

    console.error(
      error.message
    );

  }

res.redirect(
  "https://your-frontend.vercel.app/offers"
);

};

module.exports = {
  trackOpen,
  trackClick
};