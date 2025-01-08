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
import { imgUrl } from 'src/utils/BaseUrls';

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
      data?.media?.mainVideo,
      ...(data?.media?.otherVideo || []),
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

  return isPending ? (
    <LoadingScreen />
  ) : (
    <>
      <CustomBreadcrumbs
        heading={preview ? 'Artwork Preview' : 'Artwork Details'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: preview ? 'Artwork Preview' : 'Artwork Details' },
          { name: '#' + data?.artworkId },
        ]}
      />
      <div className="container mx-auto md:px-6 px-3">
        <div className="flex lg:flex-row flex-col items-center gap-5 lg:gap-10 mt-5">
          <div className="flex lg:flex-row flex-col gap-4 lg:w-[50%] w-full items-center mb-2">
            <div className="flex justify-center lg:justify-start flex-row lg:flex-col lg:max-h-[60vh] lg:h-[60vh] lg:overflow-y-auto gap-2 w-[15%] lg:ml-4">
              {images &&
                images.length > 0 &&
                images.map((file, i) => {
                  const isVideo =
                    file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mkv');

                  return isVideo ? (
                    <video
                      key={i}
                      src={`${imgUrl}/videos/${file}`}
                      className="mb-4 lg:w-20 lg:h-24 cursor-pointer object-cover"
                      onClick={() => handleThumbnailClick(i)}
                    />
                  ) : (
                    <img
                      key={i}
                      src={`${imgUrl}/users/${file}`}
                      alt={file}
                      className="mb-4 lg:w-20 lg:h-24 cursor-pointer object-cover"
                      onClick={() => handleThumbnailClick(i)}
                    />
                  );
                })}
            </div>

            <div className="flex-1 lg:w-[70%] w-full">
              {images ? (
                images.length === 1 ? (
                  <div>
                    {images[0].endsWith('.mp4') ||
                    images[0].endsWith('.webm') ||
                    images[0].endsWith('.mkv') ? (
                      <video
                        src={`${imgUrl}/videos/${images[0]}`}
                        controls
                        className="mx-auto object-cover lg:h-[60vh]"
                      />
                    ) : (
                      <img
                        src={`${imgUrl}/users/${images[0]}`}
                        alt={`Slide ${images[0] + 1}`}
                        className="mx-auto object-cover lg:h-[60vh]"
                      />
                    )}
                  </div>
                ) : (
                  <Slider
                    {...settings}
                    ref={sliderRef}
                    className="discover_more max-h-[100%] lg:mt-[-2rem] lg:h-[55vh] w-full"
                  >
                    {images.map((src, index) => (
                      <div key={index}>
                        {src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.ogg') ? (
                          <video
                            src={`${imgUrl}/videos/${src}`}
                            controls
                            className="mx-auto object-cover h-[20rem] md:h-[60vh] lg:h-[60vh]"
                          />
                        ) : (
                          <img
                            src={`${imgUrl}/users/${src}`}
                            alt={`Slide ${index + 1}`}
                            className="mx-auto object-cover h-[20rem] md:h-[60vh] lg:h-[60vh]"
                          />
                        )}
                      </div>
                    ))}
                  </Slider>
                )
              ) : (
                <div>No Media Available</div>
              )}
            </div>
          </div>

          <div className="lg:w-[50%] w-full">
            <DiscoverContent data={data} preview={preview} />
          </div>
        </div>

        <ProductInfo data={data} preview={preview} />
      </div>
      {!preview && <SelectedSection />}
    </>
  );
}
