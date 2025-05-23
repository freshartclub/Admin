import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import delivery from './assets/delivery.png';
import secure from './assets/secure.png';
import print from './assets/print.png';
import return1 from './assets/return.png';
import P from './comman/P';
import Header from './comman/Header';
import { currencies } from 'src/_mock/_currency';
import { fDateTime } from 'src/utils/format-time';
import { useEffect, useState } from 'react';

const ProductInfo = ({ type, data, preview, catalogName }) => {
  const [name, setName] = useState('');

  const mapData = (val) => {
    if (!val || val.length === 0) return '';
    return val.join(' | ');
  };

  useEffect(() => {
    if (type == 'New') {
      const catalog = data?.commercialization?.purchaseCatalog
        ? data?.commercialization?.purchaseCatalog
        : data?.commercialization?.subscriptionCatalog;
      const findId = catalogName.find((item) => item._id == catalog);

      setName(findId?.catalogName);
    }
  }, [type, data]);

  return (
    <div className="mt-10">
      <Tabs>
        <TabList>
          <Tab>Description</Tab>
          <Tab>Additional Information</Tab>
          <Tab>Commercialization</Tab>
          <Tab>Pricing</Tab>
          <Tab>Inventory & Shipping</Tab>
          <Tab>More Details</Tab>
        </TabList>

        <TabPanel>
          <div className="flex gap-8 justify-between my-5">
            <div className={`${!preview ? 'w-[75%]' : 'w-[100%]]'}`}>
              <Header
                variant={{ size: 'xl', theme: 'dark', weight: 'medium' }}
                className="my-5 mt-3"
              >
                Product information
              </Header>
              <P
                variant={{ size: 'base', theme: 'dark', weight: 'medium' }}
                className="text-[#999999] whitespace-pre-line"
              >
                {data?.productDescription}
              </P>
            </div>

            {!preview && (
              <div className="w-[25%]">
                <div className="flex items-center gap-5 my-5">
                  <img src={delivery} alt="" />
                  <div>
                    <P variant={{ size: 'base', weight: 'medium', theme: 'dark' }}>
                      Delivery 2-5 days
                    </P>
                    <P variant={{ size: 'base', weight: 'medium' }} className="text-[#999999]">
                      Get free shipping over $65.
                    </P>
                  </div>
                </div>

                <div className="flex items-center gap-5 my-5">
                  <img src={secure} alt="" />
                  <div>
                    <P variant={{ size: 'base', weight: 'medium', theme: 'dark' }}>
                      100% secure payment
                    </P>
                    <P variant={{ size: 'base', weight: 'medium' }} className="text-[#999999]">
                      Your payment information is safe.
                    </P>
                  </div>
                </div>

                <div className="flex items-center gap-5 my-5">
                  <img src={print} alt="" />
                  <div>
                    <P variant={{ size: 'base', weight: 'medium', theme: 'dark' }}>
                      Premium paper printed
                    </P>
                    <P variant={{ size: 'base', weight: 'medium' }} className="text-[#999999]">
                      Printed on premium paper (250 g/m²).
                    </P>
                  </div>
                </div>

                <div className="flex items-center gap-5 my-5">
                  <img src={return1} alt="" />
                  <div>
                    <P variant={{ size: 'base', weight: 'medium', theme: 'dark' }}>Easy Returns</P>
                    <P variant={{ size: 'base', weight: 'medium' }} className="text-[#999999]">
                      Risk-free 30-day returns.
                    </P>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel>
          <div className="flex flex-col my-5">
            <div className="grid grid-cols-1 md:grid-cols-2 place-content-between border-b pb-4">
              <div>
                <PreviewData head="Art Provider" val={data?.isArtProvider} />
                <PreviewData
                  head="Art Provider Name"
                  val={data?.provideArtistName ? data?.provideArtistName : 'N/A'}
                />
                <PreviewData
                  head="Artwork Orientation"
                  val={data?.additionalInfo?.artworkOrientation}
                />
                <PreviewData head="Artwork Technic" val={data?.additionalInfo?.artworkTechnic} />
                <PreviewData head="Artwork Theme" val={data?.additionalInfo?.artworkTheme} />
                <PreviewData head="Artwork Depth" val={data?.additionalInfo?.length + ' cm'} />
                <PreviewData head="Artwork Width" val={data?.additionalInfo?.width + ' cm'} />
                <PreviewData head="Artwork Height" val={data?.additionalInfo?.height + ' cm'} />
                <PreviewData head="Artwork Weight" val={data?.additionalInfo?.weight + ' kg'} />
              </div>

              <div>
                <PreviewData
                  head="Hanging Available"
                  val={data?.additionalInfo?.hangingAvailable}
                />
                <PreviewData head="Framed" val={data?.additionalInfo?.framed} />
                <PreviewData
                  head="Frame Depth"
                  val={
                    data?.additionalInfo?.frameLength
                      ? data?.additionalInfo?.frameLength + ' cm'
                      : 'N/A'
                  }
                />
                <PreviewData
                  head="Frame Width"
                  val={
                    data?.additionalInfo?.frameWidth
                      ? data?.additionalInfo?.frameWidth + ' cm'
                      : 'N/A'
                  }
                />
                <PreviewData
                  head="Frame Height"
                  val={
                    data?.additionalInfo?.frameHeight
                      ? data?.additionalInfo?.frameHeight + ' cm'
                      : 'N/A'
                  }
                />
                <PreviewData head="Artwork Material" val={data?.additionalInfo?.material} />
                <PreviewData
                  head="Artwork Style"
                  val={mapData(data?.additionalInfo?.artworkStyle)}
                />
                <PreviewData head="Artwork Color" val={mapData(data?.additionalInfo?.colors)} />
                <PreviewData
                  head="Artwork Emotions"
                  val={mapData(data?.additionalInfo?.emotions)}
                />
              </div>
            </div>
            <div>
              <PreviewData2
                head="Frame Description"
                val={data?.additionalInfo?.framedDescription || 'N/A'}
              />
              <PreviewData2
                head="Hanging Description"
                val={data?.additionalInfo?.hangingDescription || 'N/A'}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="flex flex-col my-5">
            <PreviewData head="Selected Method" val={data?.commercialization?.activeTab} />
            {data?.commercialization?.activeTab === 'purchase' ? (
              <>
                <PreviewData
                  head="Purchase Catalog"
                  val={
                    data?.commercialization?.publishingCatalog?.catalogName
                      ? data?.commercialization?.publishingCatalog?.catalogName
                      : name
                  }
                />
                <PreviewData head="Purchase Type" val={data?.commercialization?.purchaseType} />
              </>
            ) : (
              <>
                <PreviewData
                  head="Subscription Catalog"
                  val={
                    data?.commercialization?.publishingCatalog?.catalogName
                      ? data?.commercialization?.publishingCatalog?.catalogName
                      : name
                  }
                />
                <PreviewData head="Purchase Option" val={data?.commercialization?.purchaseOption} />
              </>
            )}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="flex flex-col my-5">
            {data?.pricing?.basePrice && (
              <PreviewData
                head="Base Price"
                val={
                  currencies.find((item) => item.code === data?.pricing?.currency.split(' ')[0])
                    ?.symbol +
                  ' ' +
                  data?.pricing?.basePrice
                }
              />
            )}
            {data?.pricing?.artistFees && (
              <PreviewData head="Artist Fees" val={data?.pricing?.artistFees + '%'} />
            )}
            {data?.pricing?.acceptOfferPrice && (
              <PreviewData
                head="Accept Offer Price"
                val={
                  currencies.find((item) => item.code === data?.pricing?.currency.split(' ')[0])
                    ?.symbol +
                  ' ' +
                  data?.pricing?.acceptOfferPrice
                }
              />
            )}
            <PreviewData head="Discount Percentage" val={data?.pricing?.dpersentage + '%'} />
            <PreviewData head="Vat Amount" val={data?.pricing?.vatAmount + '%'} />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="flex flex-col my-5">
            <PreviewData head="Location" val={data?.inventoryShipping?.location} />
            <PreviewData head="Product Code" val={data?.inventoryShipping?.pCode} />
            <PreviewData head="Package Material" val={data?.inventoryShipping?.packageMaterial} />
            <PreviewData
              head="Package Depth"
              val={data?.inventoryShipping?.packageLength + ' cm'}
            />
            <PreviewData
              head="Package Height"
              val={data?.inventoryShipping?.packageHeight + ' cm'}
            />
            <PreviewData head="Package Width" val={data?.inventoryShipping?.packageWidth + ' cm'} />
            <PreviewData
              head="Package Weight"
              val={data?.inventoryShipping?.packageWeight + ' kg'}
            />
            <PreviewData head="Comming Soon" val={String(data?.inventoryShipping?.comingSoon)} />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="flex flex-col my-5">
            <PreviewData head="Created At" val={fDateTime(data?.createdAt)} />
            <PreviewData head="Promotion" val={data?.promotions?.promotion} />
            <PreviewData head="Promotion Score" val={data?.promotions?.promotionScore} />
            <PreviewData head="Available To" val={data?.restriction?.availableTo} />
            <PreviewData head="Discount Acceptance" val={data?.restriction?.discountAcceptation} />
            <PreviewData head="Externel Tags" val={mapData(data?.tags?.extTags)} />
            <PreviewData head="Internal Tags" val={mapData(data?.tags?.intTags)} />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

function PreviewData({ head, val }) {
  return (
    <div className="flex items-center">
      <P variant={{ size: 'small', theme: 'dark', weight: 'medium' }} className="w-48 my-1">
        {head} :
      </P>
      <P variant={{ size: 'small', weight: 'medium' }} className="text-[#999999] ">
        {val ? val : 'N/A'}
      </P>
    </div>
  );
}

function PreviewData2({ head, val }) {
  return (
    <div className="my-5">
      <Header variant={{ size: 'md', theme: 'dark', weight: 'semiBold' }}>{head}</Header>
      <P
        variant={{
          size: 'small',
          weight: 'medium',
        }}
        className="mt-1 text-[#999999]"
      >
        {val ? val : 'N/A'}
      </P>
    </div>
  );
}

export default ProductInfo;
