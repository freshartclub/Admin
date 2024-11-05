import cart from './assets/cart.png';
import mark from './assets/offer.png';
import wishlist from './assets/wishlist.png';
import like from './assets/like.png';
import question from './assets/question.png';
import Button from './comman/Button';
import Header from './comman/Header';
import P from './comman/P';

const DiscoverContent = () => {
  return (
    <div>
      <P variant={{ size: 'small', weight: 'semiBold' }} className="lg:mb-5 mb-3 text-[#999999]">
        Black & White Fashion
      </P>
      <div className="flex gap-2">
        <Header variant={{ theme: 'dark', weight: 'bold' }} className="xl:text-3xl text-xl">
          Ornamental Goblet Poster
        </Header>
        <P variant={{ size: 'md', theme: 'dark', weight: 'normal' }} className="mt-5 ">
          (2021)
        </P>
      </div>

      <div className="flex lg:pb-5 pb-2 border-b lg:mt-1 gap-1">
        <P variant={{ size: 'base', theme: 'dark', weight: 'medium' }} className="text-[14px]">
          Author :
        </P>
        <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }} className="text-[14px]">
          Alfred Frost,Melany Rodriguez
        </P>
      </div>

      <div className="flex gap-2 lg:mt-2 mt-1">
        <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }} className="text-[14px]">
          Years of creation :
        </P>
        <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }} className="text-[14px]">
          2022
        </P>
      </div>

      <P
        variant={{ size: 'base', theme: 'dark', weight: 'normal' }}
        className="lg:mt-2 mt-1 text-[14px]"
      >
        Newyork, USA
      </P>

      <P
        variant={{ size: 'base', theme: 'dark', weight: 'normal' }}
        className="lg:my-6 my-2 text-[14px]"
      >
        Quia in harum exercitationem sit sequi omnis. Tenetur id facere illo dolor. Nulla molestiae
        voluptatem mollitia ullam necessitatibus sit quibusdam.
      </P>

      <div className="flex">
        <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }} className="text-[14px]">
          Size :{' '}
        </P>
        <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }} className="text-[14px]">
          17 x 54 x 55
        </P>
      </div>

      <Header variant={{ size: 'xl', theme: 'dark', weight: 'semiBold' }} className="lg:my-4 my-2">
        $120.00
      </Header>

      <div className="flex md:flex-row flex-col xl:gap-10 gap-2">
        <Button
          variant={{
            theme: 'dark',
            fontWeight: '600',
            rounded: 'full',
          }}
          className="text-base flex items-center justify-center   w-full"
        >
          <img src={cart} alt="" className="md:mx-2 mx-1" />
          <P variant={{ size: 'base', theme: 'light', weight: 'normal' }}>Add to cart</P>
        </Button>

        <Button
          variant={{
            theme: '',
            rounded: 'full',
          }}
          className="text-base flex items-center justify-center border  w-full"
        >
          <img src={mark} alt="" className="md:mx-2 mx-1" />
          <P variant={{ size: 'base', theme: 'dark', weight: 'normal' }}>Make an offer</P>
        </Button>
      </div>

      <div className="flex lg:flex-row flex-col w-full xl:justify-end lg:justify-between lg:items-center gap-2 lg:my-6 my-3">
        <div className="flex items-center lg:justify-center gap-2 xl:w-[30%]">
          <img src={wishlist} alt="whishlist icon" />
          <P
            variant={{ size: 'small', weight: 'semiBold' }}
            className="text-[#999999] uppercase text-[11px]"
          >
            Add to Wishlist
          </P>
        </div>

        <div className="flex items-center lg:justify-center gap-2 xl:w-[30%]">
          <img src={like} alt="like btn" />
          <P
            variant={{ size: 'small', weight: 'semiBold' }}
            className="text-[#999999] uppercase  text-[11px]"
          >
            LIKE
          </P>
        </div>

        <div className="flex gap-2 items-center lg:justify-center xl:w-[30%]">
          <img src={question} alt="question" />
          <P
            variant={{ size: 'small', weight: 'semiBold' }}
            className="text-[#999999] uppercase text-[11px]"
          >
            Ask Questions
          </P>
        </div>
      </div>

      <div>
        <div className="flex gap-2 my-2">
          <P variant={{ size: 'small', theme: 'dark', weight: 'medium' }} className="uppercase">
            SKU :
          </P>
          <P variant={{ size: 'small', weight: 'medium' }} className=" text-[#999999] text-[14px]">
            2489
          </P>
        </div>
        <div className="flex gap-2 my-2">
          <P variant={{ size: 'small', theme: 'dark', weight: 'medium' }} className="uppercase">
            CATEGories :
          </P>
          <P
            variant={{ size: 'small', weight: 'medium' }}
            className="capitalize text-[#999999] text-[14px]"
          >
            All Art pribts posters
          </P>
        </div>
        <div className="flex gap-2 my-2">
          <P variant={{ size: 'small', theme: 'dark', weight: 'medium' }} className="uppercase">
            tags:
          </P>
          <P
            variant={{ size: 'small', weight: 'medium' }}
            className="capitalize text-[#999999] text-[14px]"
          >
            {' '}
            Art design graphic art illustration photography
          </P>
        </div>
      </div>
    </div>
  );
};

export default DiscoverContent;
