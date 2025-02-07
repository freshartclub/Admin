import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import DiscoverContent from './DiscoverContent';
import ProductInfo from './ProductInfo';
import SelectedSection from './SelectedSection';
import { QRCodeCanvas } from 'qrcode.react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGetArtworkById } from './http/useGetArtworkById';
import { imgUrl } from 'src/utils/BaseUrls';
import { Iconify } from 'src/components/iconify';
import { Modal } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import { toast } from 'sonner';
import { useGetCatalogsName } from './http/useGetCatalogsName';

export function ArtworkDetailView() {
  const preview = useSearchParams().get('preview');
  const id = useSearchParams().get('id');
  const [images, setImages] = useState<any>([]);
  const [openQR, setOpenQR] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [data, setData] = useState<any>({});
  const [type, setType] = useState('Old');

  const { data: artData, isPending } = useGetArtworkById(id);
  const { data: catalogName } = useGetCatalogsName();

  useEffect(() => {
    if (artData && type === 'Old') {
      setData(artData);
    }

    if (artData && type === 'New') {
      setData(artData?.reviewDetails);
    }
  }, [artData, type]);

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

  const generateQRCode = () => {
    if (!id) return toast.error('Publish the artwork first');
    const url = `${import.meta.env.VITE_SERVER_BASE_URL}/all-artworks?type=${data?.commercialization?.activeTab}&referral=QR`;
    setQrCode(url);
    setOpenQR(true);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `QR Code - ${data?.artworkName}.png`;
    link.click();
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
          { name: '#' + artData?.artworkId },
        ]}
        action={
          artData && artData?.status === 'published' ? (
            <div className="bread-links flex gap-2 items-center">
              <span
                onClick={generateQRCode}
                className="bg-black cursor-pointer text-white rounded-md justify-center flex items-center px-2 py-3 gap-2"
              >
                <Iconify icon="mingcute:add-line" /> Generate QR Code
              </span>
              <span className="bg-black cursor-pointer text-white rounded-md justify-center flex items-center px-2 py-3 gap-2">
                <Iconify icon="mingcute:add-line" /> Generate Certificate Of Authenticity
              </span>
            </div>
          ) : artData && artData?.status === 'modified' ? (
            <div className="bread-links flex gap-2 items-center">
              <span
                onClick={() => setType('Old')}
                className={`sm:w-max w-full p-2 rounded font-semibold cursor-pointer bg-purple-200 ${type === 'Old' ? 'border text-purple-950 border-purple-950 shadow-md' : 'text-gray-500'} `}
              >
                Old Version
              </span>
              <span
                onClick={() => setType('New')}
                className={`sm:w-max w-full p-2 rounded font-semibold cursor-pointer bg-purple-200 border  ${type === 'New' ? 'border text-purple-950 border-purple-950 shadow-md' : 'text-gray-500'}`}
              >
                Latest Version
              </span>
            </div>
          ) : null
        }
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
            <DiscoverContent
              data={data}
              preview={preview}
              artworkId={artData?.artworkId}
              name1={artData?.owner?.artistName}
              name2={artData?.owner?.artistSurname1}
              name3={artData?.owner?.artistSurname2}
              status={artData?.status}
            />
          </div>
        </div>

        <ProductInfo type={type} data={data} preview={preview} catalogName={catalogName} />
      </div>
      {!preview && <SelectedSection />}
      <Modal open={openQR} onClose={() => setOpenQR(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Generated QR Code
          </Typography>
          <QRCodeCanvas value={qrCode} size={200} />
          <span className="flex flex-col">
            <Button variant="contained" color="secondary" onClick={downloadQRCode} sx={{ mt: 2 }}>
              Download QR Code
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenQR(false)}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </span>
        </Box>
      </Modal>
    </>
  );
}
