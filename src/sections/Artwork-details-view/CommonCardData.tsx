import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import like from './assets/like.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface HighlightItem {
  image: string;
  title: string;
  heading: string;
  size: string;
  para: string;
  price: string;
}

interface HandleLikeClickParams {
  heading: string;
  highlightData: HighlightItem[];
}

const CommonCardData = ({ heading, highlightData }: HandleLikeClickParams) => {
  const [isLiked, setIsLiked] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  const navigate = useNavigate();
  const handleRedirectToDescription = () => {
    navigate('/discover_more');
    window.scroll(0, 0);
  };
  
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };
  return (
    <>
      <div className="my-10">
        <h1 className="text-[30px] font-semibold mb-5 w-52 sm:w-full">{heading}</h1>
        <Slider {...settings}>
          {highlightData.map((item, index) => (
            <div key={index} className="sm:px-3 px-0 border-none outline-none relative">
              <img
                src={item.image}
                alt="image"
                className="w-full shadow-xl"
                onClick={handleRedirectToDescription}
              />

              <div className="mt-3">
                <p className="text-[14px] text-[#696868]">{item.title}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="font-bold text-[20px] text-[#333333] xl:w-[80%] lg:w-[70%] w-[80%] line-clamp-2">
                      {item.heading}
                    </h1>
                    <p className="text-[14px] text-[#696868]">{item.para}</p>
                    <p className="text-[14px] text-[#696868]">{item.size}</p>
                  </div>
                  <div>
                    <button
                      onClick={handleLikeClick}
                      className={` border rounded-full px-3 py-3 cursor-pointer
                      ${isLiked ? 'bg-[#FFD9DE]' : 'bg-white'} transition-all`}
                    >
                      <img
                        src={like}
                        alt="like"
                        className={`w-[3rem] h-[1.3rem] ${
                          isLiked ? 'filter brightness-0 saturate-100' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className="text-[14px] font-bold">{item.price}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default CommonCardData;
