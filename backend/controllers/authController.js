const prisma =
  require("../prisma/prismaClient");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const {
  sendOTPEmail,
} = require(
  "../services/emailService"
);

const register =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Missing required registration fields."
        });
      }

      const existingUser =
        await prisma.user.findUnique({
          where: { email },
        });

      if (existingUser) {

        return res.status(400).json({
          message:
            "User already exists",
        });

      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );
      await prisma.user.create({

        data: {
          name,
          email,
          password:
            hashedPassword,
        },

      });

      const otp =
        Math.floor(
          100000 +
          Math.random() * 900000
        ).toString();
      await prisma.oTP.create({

        data: {

          email,

          otp,

          expiresAt:
            new Date(
              Date.now() +
              10 * 60 * 1000
            ),

        },

      });

      try {

        await sendOTPEmail(
          email,
          otp
        );

      } catch (err) {
        console.error(`[AUTH] Failed to send registration email to ${email}:`, err.message);
      }

      console.log(`[AUTH] User Registered: ${email}`);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[AUTH] Generated OTP for ${email} (dev-only): ${otp}`);
      }

      res.status(201).json({

        message:
          "OTP generated successfully",

      });
    } catch (error) {

      console.error(`[AUTH] Registration error:`, error);

      return res.status(500).json({
        message: error.message
      });

    }

  };

const verifyOTP =
  async (req, res) => {

    try {

      const {
        email,
        otp,
      } = req.body;

      const otpRecord =
        await prisma.oTP.findFirst({

          where: {
            email,
            otp,
          },

          orderBy: {
            createdAt:
              "desc",
          },

        });

      if (!otpRecord) {

        return res.status(400).json({
          message:
            "Invalid OTP",
        });

      }

      if (
        otpRecord.expiresAt <
        new Date()
      ) {

        return res.status(400).json({
          message:
            "OTP Expired",
        });

      }

      await prisma.user.update({

        where: {
          email,
        },

        data: {
          isVerified:
            true,
        },

      });

      await prisma.oTP.delete({

        where: {
          id:
            otpRecord.id,
        },

      });

      const user =
  await prisma.user.findUnique({

    where: {
      email,
    },

  });

const token =
  jwt.sign(

    {
      userId:
        user.id,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }

  );

res.status(200).json({

  message:
    "Email Verified Successfully",

  token,

  user,

});

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

};

const login =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Missing email or password."
        });
      }

      const user =
        await prisma.user.findUnique({
          where: { email },
        });

      if (!user) {

        return res.status(400).json({
          message:
            "Invalid Credentials",
        });

      }

      if (!user.isVerified) {

        return res.status(400).json({

          message:
            "Please verify your email first",

        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Invalid Credentials",
        });

      }

const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

      console.log(`[AUTH] Login Successful: ${email}`);

      res.status(200).json({

        token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },

      });

    } catch (error) {

      console.error("[AUTH] Login error:", error);

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

const forgotPassword =
  async (req, res) => {

    try {

      const { email } =
        req.body;

      const user =
        await prisma.user.findUnique({
          where: { email },
        });

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });

      }

      const otp =
        Math.floor(
          100000 +
          Math.random() * 900000
        ).toString();

      await prisma.oTP.create({

        data: {

          email,

          otp,

          expiresAt:
            new Date(
              Date.now() +
              10 * 60 * 1000
            ),

        },

      });

      await sendOTPEmail(
        email,
        otp
      );

      res.status(200).json({

        message:
          "Reset OTP sent",

      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

};

const resetPassword =
  async (req, res) => {

    try {

      const {
        email,
        otp,
        newPassword,
      } = req.body;

      const otpRecord =
        await prisma.oTP.findFirst({

          where: {
            email,
            otp,
          },

          orderBy: {
            createdAt:
              "desc",
          },

        });

      if (!otpRecord) {

        return res.status(400).json({

          message:
            "Invalid OTP",

        });

      }

      if (
        otpRecord.expiresAt <
        new Date()
      ) {

        return res.status(400).json({

          message:
            "OTP Expired",

        });

      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      await prisma.user.update({

        where: {
          email,
        },

        data: {
          password:
            hashedPassword,
        },

      });

      await prisma.oTP.delete({

        where: {
          id:
            otpRecord.id,
        },

      });

      res.status(200).json({

        message:
          "Password Updated Successfully",

      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

};

const resendOTP =
  async (req, res) => {

    try {

      const { email } =
        req.body;

      const otp =
        Math.floor(
          100000 +
          Math.random() * 900000
        ).toString();

      await prisma.oTP.create({

        data: {

          email,

          otp,

          expiresAt:
            new Date(
              Date.now() +
              10 * 60 * 1000
            ),

        },

      });

      await sendOTPEmail(
        email,
        otp
      );

      res.status(200).json({

        message:
          "OTP Resent Successfully",

      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

};

module.exports = {
  register,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
  resendOTP,
};