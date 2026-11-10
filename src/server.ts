import { createApp } from './app';

const PORT = process.env.PORT ?? 3000;

createApp().listen(PORT, () => {
  console.log(`Cafeteria Origen API escuchando en http://localhost:${PORT}`);
});
