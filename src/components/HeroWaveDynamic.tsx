import { useEffect, useState } from 'react';
import HeroWave from './HeroWave';

const slugify = (str: string): string =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
    .toLowerCase()
    .replaceAll(' ', '-')
    .replace(/[^a-z0-9-]/g, ''); // Solo letras, números y guiones

const HeroWaveDynamic = () => {
  const [lineas, setLineas] = useState(['PRODUCTOS BIGFOOT']);
  const [subtitulo, setSubtitulo] = useState('CONOCE LAS VENTAJAS DE BIGFOOT');
  const [imagen, setImagen] = useState('/img/contacto/portada.webp');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoria = searchParams.get('categoria') ?? 'porDefecto';
    const slug = slugify(categoria);
    const slugsValidos = ['snowboard', 'esqui', 'porDefecto'];
    const slugEsValido = slugsValidos.includes(slug);
    const categoriaValida = slugEsValido ? slug : 'porDefecto';
    console.log('categoria', categoria);
    console.log('slug', slug);
    console.log('categoriaValida', categoriaValida);
    switch (categoriaValida) {
      case 'snowboard':
        setLineas(['PRODUCTOS SNOWBOARD']);
        setSubtitulo('DESCUBRE NUESTRO MATERIAL PARA SNOW');
        setImagen('/img/productos/snowboard.webp');
        break;
      case 'esqui':
        setLineas(['PRODUCTOS SKII']);
        setSubtitulo('TODO LO QUE NECESITAS PARA EL SKII');
        setImagen('/img/productos/skii.webp');
        break;
      default:
        setLineas(['PRODUCTOS BIGFOOT']);
        setSubtitulo('CONOCE LAS VENTAJAS DE BIGFOOT');
        setImagen('/img/productos/portada.webp');
        break;
    }
  }, []);

  return (
    <HeroWave
      imagen={imagen}
      alt="Productos del equipo Bigfoot"
      lineas={lineas}
      subtitulo={subtitulo}
      href="#contenido"
    />
  );
};

export default HeroWaveDynamic;
