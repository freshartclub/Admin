import { currencies } from 'src/_mock/_currency';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import cart from './assets/cart.png';
import mark from './assets/offer.png';
import Button from './comman/Button';
import Header from './comman/Header';
import P from './comman/P';
import usePublishArtworkMutation from './http/usePublishArtworkMutation';

const DiscoverContent = ({ data, preview, name1, name2, name3, status }) => {
  const { mutate, isPending } = usePublishArtworkMutation(data?._id);

  const name = (name1, name2, name3) => {
    let fullName = name1 || '';

    if (name2) fullName += ' ' + name2;
    if (name3) fullName += ' ' + name3;

    return fullName.trim();
  };

  const publishArtwork = async () => {
    await mutate();
  };

  return (
    <div>
      <section className="flex lg:items-center flex-col lg:flex-row justify-between border-b pb-2 gap-1">
        <div>
          <Header variant={{ size: '2xl', theme: 'dark', weight: 'bold' }}>
            {data?.artworkName}
          </Header>

          <div className="flex lg:pb-2 pb-2 lg:mt-1 gap-1">
            <Header
              variant={{ size: 'base', theme: 'dark', weight: 'medium' }}
              className="text-[14px]"
            >
              Author :
            </Header>
            <P variant={{ size: 'base', weight: 'normal' }} className="text-[14px] text-[#999999]">
              {name(name1, name2, name3)}
            </P>
          </div>
        </div>
        <div className="flex gap-2 w-full lg:w-fit">
          {status === 'draft' ? (
            <button className="w-full lg:w-fit" onClick={publishArtwork}>
              <span className="font-bold block text-center rounded-full bg-black text-white px-5 py-3">
                {isPending ? 'Sending...' : 'Publish'}
              </span>
            </button>
          ) : status === 'rejected' ? (
            <button className="w-full lg:w-fit pointer-events-none">
              <span className="font-bold block text-center rounded-full bg-red-700 text-white px-5 py-3">
                Rejected
              </span>
            </button>
          ) : status === 'published' ? (
            <button className="w-full lg:w-fit pointer-events-none">
              <span className="font-bold block text-center rounded-full bg-green-700 text-white px-5 py-3">
                Published
              </span>
            </button>
          ) : status === 'modified' ? (
            <button className="w-full lg:w-fit pointer-events-none">
              <span className="font-bold block text-center rounded-full bg-purple-700 text-white px-5 py-3">
                Modified
              </span>
            </button>
          ) : null}
          {preview && status === 'draft' ? (
            <RouterLink
              className="w-full lg:w-fit"
              href={`${paths.dashboard.artwork.addArtwork}?id=${data?._id}`}
            >
              <span className="font-bold block text-center rounded-full border-[1.5px] text-black px-5 py-3">
                Continue Edit
              </span>
            </RouterLink>
          ) : null}
        </div>
      </section>
      <div className="flex gap-1 lg:mt-2 mt-1">
        <Header variant={{ size: 'base', theme: 'dark', weight: 'medium' }} className="text-[14px]">
          Artwork ID :
        </Header>
        <P variant={{ size: 'base', weight: 'normal' }} className="text-[14px] text-[#999999]">
          {data?.artworkId}
        </P>
      </div>
      <div className="flex gap-1 lg:mt-2 mt-1">
        <Header variant={{ size: 'base', theme: 'dark', weight: 'medium' }} className="text-[14px]">
          Years of creation :
        </Header>
        <P variant={{ size: 'base', weight: 'normal' }} className="text-[14px] text-[#999999]">
          {data?.artworkCreationYear}
        </P>
      </div>
      <div className="flex gap-1 lg:mt-2 mt-1">
        <Header variant={{ size: 'base', theme: 'dark', weight: 'medium' }} className="text-[14px]">
          Artwork Series :
        </Header>
        <P variant={{ size: 'base', weight: 'normal' }} className="text-[14px] text-[#999999]">
          {data?.artworkSeries}
        </P>
      </div>

      <P
        variant={{ size: 'base', theme: 'dark', weight: 'normal' }}
        className="lg:my-4 my-2 text-[14px] text-[#999999]"
      >
        {(data?.productDescription || '')
          .replace(/(<([^>]+)>)/gi, '')
          .slice(0, 270)
          .concat('...')}
      </P>

      <div className="flex gap-1">
        <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }} className="text-[14px]">
          Size :
        </P>
        <P
          variant={{ size: 'base', theme: 'dark', weight: 'normal' }}
          className="text-[14px] text-[#999999]"
        >
          {data?.additionalInfo?.length} x {data?.additionalInfo?.width} x{' '}
          {data?.additionalInfo?.height} cm
        </P>
      </div>

      <Header variant={{ size: 'xl', theme: 'dark', weight: 'semiBold' }} className="lg:my-4 my-2">
        {currencies.find((item) => item.code === data?.pricing?.currency.split(' ')[0])?.symbol +
          ' ' +
          data?.pricing?.basePrice}
      </Header>

      {preview ? null : (
        <div className="flex md:flex-row flex-col xl:gap-10 gap-2">
          <Button
            variant={{
              theme: 'dark',
              fontWeight: '600',
              rounded: 'full',
            }}
            className={`text-base flex items-center justify-center w-full ${preview && 'pointer-events-none opacity-50'}`}
          >
            <img src={cart} alt="" className="md:mx-2 mx-1" />
            <P variant={{ size: 'base', theme: 'light', weight: 'normal' }}>Add to cart</P>
          </Button>

          <Button
            variant={{
              theme: '',
              rounded: 'full',
            }}
            className={`text-base flex items-center justify-center border  w-full ${preview && 'pointer-events-none opacity-50'}`}
          >
            <img src={mark} alt="" className="md:mx-2 mx-1" />
            <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }}>Make an offer</P>
          </Button>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 my-4">
        {/* {preview ? null : (
          <div
            className={`flex w-full justify-between gap-1 flex-wrap ${preview && 'pointer-events-none opacity-50'}`}
          >
            <div className="flex items-center gap-2">
              <img src={wishlist} alt="whishlist icon" />
              <P
                variant={{ size: 'small', weight: 'semiBold' }}
                className="text-[#999999] uppercase text-[11px]"
              >
                Add to Wishlist
              </P>
            </div>

            <div className="flex items-center gap-2">
              <img src={like} alt="like btn" />
              <P
                variant={{ size: 'small', weight: 'semiBold' }}
                className="text-[#999999] uppercase  text-[11px]"
              >
                LIKE
              </P>
            </div>

            <div className="flex gap-2 items-center">
              <img src={question} alt="question" />
              <P
                variant={{ size: 'small', weight: 'semiBold' }}
                className="text-[#999999] uppercase text-[11px]"
              >
                Ask Questions
              </P>
            </div>
          </div>
        )} */}
        <div className="flex flex-wrap w-full justify-between">
          <div className="flex gap-1">
            <P variant={{ size: 'small', theme: 'dark', weight: 'medium' }} className="uppercase">
              Product Code :
            </P>
            <P
              variant={{ size: 'small', weight: 'medium' }}
              className=" text-[#999999] text-[14px]"
            >
              {data?.inventoryShipping?.pCode ? data?.inventoryShipping?.pCode : 'N/A'}
            </P>
          </div>
          <div className="flex gap-1">
            <P variant={{ size: 'small', theme: 'dark', weight: 'medium' }} className="uppercase">
              Discipline :
            </P>
            <P
              variant={{ size: 'small', weight: 'medium' }}
              className="capitalize text-[#999999] text-[14px]"
            >
              {data?.discipline?.artworkDiscipline}
            </P>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverContent;
