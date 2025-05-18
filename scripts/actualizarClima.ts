// scripts/actualizarClima.ts
import { actualizarClimaMontanas } from '../utils/actualizarClimaMontaña';

actualizarClimaMontanas()
  .then(() => {
    console.log('✅ Script finalizado correctamente.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  });
