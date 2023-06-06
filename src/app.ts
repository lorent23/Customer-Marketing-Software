import { sendEmail } from './utils/mailService';
import express, { Express, RequestHandler } from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import * as i18next from 'i18next'
import * as Backend from 'i18next-fs-backend'
import * as middleware from 'i18next-http-middleware'
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './utils/swagger.json'

import { authRoute, permissionRoute, roleRoute, userRoute, companyRoute, userDataRoute, ipDataRoute } from "./routes";

dotenv.config();


i18next
  .use(Backend.default)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: process.env.DEFAULT_LANG,
    backend: {
      loadPath: './lang/{{lng}}.json'
    }
  })

const app = express();

app.use(cors());

// For parsing application/json
app.use(express.json() as RequestHandler);

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }) as RequestHandler);

app.use(cookieParser());

// For translating with Accept-Language header
app.use(middleware.handle(i18next.default));

app.get('/', (req: any, res: any) => {
  res.json({
    message: req.t('welcome'),
  })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/roles", roleRoute);
app.use("/api/permissions", permissionRoute);
app.use("/api/companies", companyRoute);
app.use("/api/user-data", userDataRoute);
app.use("/api/ip-data", ipDataRoute);

export default app;
