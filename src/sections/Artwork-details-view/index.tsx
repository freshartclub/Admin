import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import eye from './assets/eye.png';
import share from './assets/share.png';
import DiscoverContent from './DiscoverContent';
import ProductInfo from './ProductInfo';
import SelectedSection from './SelectedSection';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { useSearchParams } from 'src/routes/hooks';
import { useGetArtworkById } from './http/useGetArtworkById';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

export function ArtworkDetailView() {
  const preview = useSearchParams().get('preview');
  const id = useSearchParams().get('id');
  const [images, setImages] = useState<any>([]);

  const { data, isPending } = useGetArtworkById(id);

  useEffect(() => {
    const arr = [
      data?.media?.mainImage,
      data?.media?.backImage,
      data?.media?.inProcessImage,
      ...(data?.media?.images || []),
    ].filter(Boolean);

    setImages(arr);
  }, [data]);

  const sliderRef = useRef<Slider>(null);
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleThumbnailClick = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const url = 'http://localhost:5000/uploads/users';

  return isPending ? (
    <LoadingScreen />
  ) : (
    <>
      <CustomBreadcrumbs
        heading={preview ? 'Artwork Preview' : 'Artwork Details'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: preview ? 'Artwork Preview' : 'Artwork Details' },
        ]}
      />
      <div className="container mx-auto md:px-6 px-3">
        <div className="flex lg:flex-row flex-col items-center gap-10 mt-5">
          <div className="flex md:flex-row flex-col gap-4 lg:w-[50%] w-full items-center">
            <div className="flex md:flex-col flex-row md:gap-0 gap-2 w-[15%] lg:ml-4">
              {images &&
                images.length > 0 &&
                images.map((img, i) => (
                  <img
                    key={i}
                    src={`${url}/${img}`}
                    alt={img}
                    className="mb-4 lg:w-20 lg:h-24 cursor-pointer object-cover"
                    onClick={() => handleThumbnailClick(i)}
                  />
                ))}
            </div>

            <div className="flex-1 lg:w-[70%] w-full">
              {images ? (
                images.length === 1 ? (
                  <div>
                    <img
                      src={`${url}/${images[0]}`}
                      alt={`Slide ${images[0] + 1}`}
                      className="mx-auto object-cover lg:h-[60vh]"
                    />
                  </div>
                ) : (
                  <Slider {...settings} ref={sliderRef} className="discover_more lg:h-[50vh]">
                    {images.map((src, index) => (
                      <div key={index}>
                        <img
                          src={`${url}/${src}`}
                          alt={`Slide ${index + 1}`}
                          className="mx-auto object-cover lg:h-[60vh]"
                        />
                      </div>
                    ))}
                  </Slider>
                )
              ) : (
                <div>No Image Available</div>
              )}
            </div>
          </div>

          <div className="lg:w-[50%] w-full">
            <DiscoverContent data={data} preview={preview} />
          </div>
        </div>

        {/* <div className="flex justify-center md:w-[50%] w-full gap-10 mb-10">
          <div className="flex gap-1">
            <img src={eye} alt="eye" className="w-[19px] h-[12px] mt-1" />
            <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }}>View in Room</P>
          </div>
          <Button className="flex gap-1 !p-0">
            <img src={share} alt="share" className="w-[19px] h-[16px] mt-1" />
            <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }}>Share</P>
          </Button>
        </div> */}

        <ProductInfo data={data} preview={preview} />
      </div>
      {!preview && <SelectedSection />}
    </>
  );
}