import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

const specs = yaml.load(fs.readFileSync('./public/bundled.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/tasks', taskRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
