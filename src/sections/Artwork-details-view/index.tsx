import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import DiscoverContent from './DiscoverContent';
import ProductInfo from './ProductInfo';
import SelectedSection from './SelectedSection';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGetArtworkById } from './http/useGetArtworkById';

export function ArtworkDetailView() {
  const preview = useSearchParams().get('preview');
  const id = useSearchParams().get('id');
  const [images, setImages] = useState<any>([]);

  const { data, isPending } = useGetArtworkById(id);

  console.log(data?.data);

  useEffect(() => {
    const arr = [
      data?.data?.media?.mainImage,
      data?.data?.media?.backImage,
      data?.data?.media?.inProcessImage,
      ...(data?.data?.media?.images || []),
    ].filter(Boolean);

    setImages(arr);
  }, [data?.data]);

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

  const url = 'https://dev.freshartclub.com/images/users';

  return isPending ? (
    <LoadingScreen />
  ) : (
    <>
      <CustomBreadcrumbs
        heading={preview ? 'Artwork Preview' : 'Artwork Details'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: preview ? 'Artwork Preview' : 'Artwork Details' },
          { name: '#' + data?.data?.artworkId },
        ]}
      />
      <div className="container mx-auto md:px-6 px-3">
        <div className="flex lg:flex-row flex-col items-center gap-5 lg:gap-10 mt-5">
          <div className="flex lg:flex-row flex-col gap-4 lg:w-[50%] w-full items-center mb-2">
            <div className="flex justify-center flex-row lg:flex-col lg:max-h-[60vh] lg:h-[60vh] lg:overflow-y-auto gap-2 w-[15%] lg:ml-4">
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
                  <Slider
                    {...settings}
                    ref={sliderRef}
                    className="discover_more max-h-[100%] lg:h-[55vh] w-full"
                  >
                    {images.map((src, index) => (
                      <div key={index}>
                        <img
                          src={`${url}/${src}`}
                          alt={`Slide ${index + 1}`}
                          className="mx-auto object-cover h-[20rem] md:h-[60vh] lg:h-[60vh]"
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
            <DiscoverContent data={data?.data} preview={preview} />
          </div>
        </div>

        <ProductInfo data={data?.data} preview={preview} />
      </div>
      {!preview && <SelectedSection />}
    </>
  );
}
