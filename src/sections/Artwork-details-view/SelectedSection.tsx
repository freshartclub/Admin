import CommonCardData from './CommonCardData';
import img1 from './assets/Overlay+Shadow (1).png';
import img2 from './assets/oiloncanvasofalittlegirl.jpg.png';
import img3 from './assets/Frame 1000009408.png';

const highlightData = [
  {
    image: img1,
    title: 'Illustrator, painting',
    heading: 'Nineteenth-Century Pastel Portraits',
    para: 'Andrews meson',
    size: '70 x 32 ',
    price: '$65.00',
  },
  {
    image: img2,
    title: 'Illustrator, painting',
    heading: 'Nineteenth-Century Pastel Portraits',
    para: 'Andrews meson',
    size: '70 x 32 ',
    price: '$65.00',
  },
  {
    image: img3,
    title: 'Illustrator, painting',
    heading: 'Nineteenth-Century Pastel Portraits',
    para: 'Andrews meson',
    size: '70 x 32 ',
    price: '$65.00',
  },
  {
    image: img2,
    title: 'Illustrator, painting',
    heading: 'Nineteenth-Century Pastel Portraits',
    para: 'Andrews meson',
    size: '70 x 32 ',
    price: '$65.00',
  },
];

const SelectedSection = () => {
  return <CommonCardData heading="From this artist" highlightData={highlightData} />;
};

export default SelectedSection;
