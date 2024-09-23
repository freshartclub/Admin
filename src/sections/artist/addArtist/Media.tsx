import { Formik } from 'formik';

// import vediologo from '../../../assets/Images/Clip path group.png';
// import logoimg from '../../../assets/Images/illustration-upload.png';

export function Media({ handelNext }) {
  const initialValues = {
    mainphoto: '',
    AdditionalImage: '',
    InprocessPhoto: '',
    MainVideo: '',
    AdditionalVideo: '',
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, action) => {
        console.log(values);
        action.resetForm();
        handelNext();
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
        errors,
        touched,
        resetForm,
      }) => (
        <div className="bg-white p-4 rounded-lg">
          <form onSubmit={handleSubmit}>
            <h1 className="text-[18px] text-black font-semibold mb-1 mt-4">Media</h1>
            <div className="grid md:grid-cols-3 gap-3">
              <label className="p-1 text-[14px] font-semibold" htmlFor="mainphoto">
                {' '}
                Main photo
                <div className="w-full bg-gray-50 rounded-md p-2 mb-2 flex flex-col pt-10 items-center justify-center mt-2">
                  {
                    values.mainphoto ? (
                      <img
                        src={URL.createObjectURL(values.mainphoto)}
                        alt="Main Artwork"
                        className="w-[90px] h-[60px] rounded-md"
                      />
                    ) : null

                    // <img src={logoimg} alt="Default Logo" />
                  }
                  <p className="text-[14px] py-2 text-[#203F58] flex justify-center mx-auto text-center">
                    Drag and drop image here, or click add image
                  </p>
                  <div className="px-2 py-1 text-black bg-gray-400 rounded-md mt-3 hover:cursor-pointer">
                    Add Image
                  </div>
                  <input
                    type="file"
                    name="mainphoto"
                    id="mainphoto"
                    onChange={(event) => setFieldValue('mainphoto', event.currentTarget.files[0])}
                    className="w-full bg-gray-50 rounded-md p-2 mb-2 opacity-0"
                  />
                </div>
              </label>
              <label className="p-1 text-[14px] font-semibold" htmlFor="AdditionalImage">
                {' '}
                Additional images
                <div className="w-full bg-gray-50 rounded-md p-2 mb-2 flex flex-col pt-10 items-center justify-center mt-2">
                  {
                    values.AdditionalImage ? (
                      <img
                        src={URL.createObjectURL(values.AdditionalImage)}
                        alt="Main Artwork"
                        className="w-[90px] h-[60px] rounded-md"
                      />
                    ) : null
                    // <img src={logoimg} alt="Default Logo"
                  }
                  <p className="text-[14px] py-2 text-[#203F58] flex justify-center mx-auto text-center">
                    Drag and drop image here, or click add image
                  </p>
                  <div className="px-2 py-1 text-black bg-gray-400 rounded-md mt-3 hover:cursor-pointer">
                    Add Image
                  </div>
                  <input
                    type="file"
                    name="AdditionalImage"
                    id="AdditionalImage"
                    onChange={(event) =>
                      setFieldValue('AdditionalImage', event.currentTarget.files[0])
                    }
                    className="w-full bg-gray-50 rounded-md p-2 mb-2 opacity-0"
                  />
                </div>
              </label>
              <label className="p-1 text-[14px] font-semibold" htmlFor="InprocessPhoto">
                {' '}
                Inprocess Photo
                <div className="w-full bg-gray-50 rounded-md p-2 mb-2 flex flex-col pt-10 items-center justify-center mt-2">
                  {
                    values.InprocessPhoto ? (
                      <img
                        src={URL.createObjectURL(values.InprocessPhoto)}
                        alt="Main Artwork"
                        className="w-[90px] h-[60px] rounded-md"
                      />
                    ) : null
                    // <img src={logoimg} alt="Default Logo" />
                  }
                  <p className="text-[14px] py-2 text-[#203F58] flex justify-center mx-auto text-center">
                    Drag and drop image here, or click add image
                  </p>
                  <div className="px-2 py-1 text-black bg-gray-400 rounded-md mt-3 hover:cursor-pointer">
                    Add Image
                  </div>
                  <input
                    type="file"
                    name="InprocessPhoto"
                    id="InprocessPhoto"
                    onChange={(event) =>
                      setFieldValue('InprocessPhoto', event.currentTarget.files[0])
                    }
                    className="w-full bg-gray-50 rounded-md p-2 mb-2 opacity-0"
                  />
                </div>
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="p-1 text-[14px] font-semibold" htmlFor="MainVideo">
                {' '}
                Main Video
                <div className="w-full bg-gray-50 rounded-md p-2 mb-2 flex flex-col pt-10 items-center justify-center mt-2">
                  {
                    values.MainVideo ? (
                      <video
                        src={URL.createObjectURL(values.MainVideo)}
                        controls
                        className="w-[90px] h-[60px] rounded-md"
                      >
                        <track
                          kind="captions"
                          src="path_to_captions.vtt"
                          srcLang="en"
                          label="English"
                        />
                      </video>
                    ) : null
                    // <img src={vediologo} alt="Default Logo" />
                  }
                  <p className="text-[14px] py-2 text-[#203F58]">
                    Drag and drop video here, or click add video
                  </p>
                  <div className="px-2 py-1 text-black bg-gray-400 rounded-md mt-3 hover:cursor-pointer">
                    Add Video
                  </div>
                  <input
                    type="file"
                    name="MainVideo"
                    id="MainVideo"
                    accept="video/*"
                    onChange={(event) => setFieldValue('MainVideo', event.currentTarget.files[0])}
                    className="w-full bg-gray-50 rounded-md p-2 mb-2 opacity-0"
                  />
                </div>
              </label>
              <label className="p-1 text-[14px] font-semibold" htmlFor="AdditionalVideo">
                {' '}
                Additional Video
                <div className="w-full bg-gray-50 rounded-md p-2 mb-2 flex flex-col pt-10 items-center justify-center mt-2">
                  {
                    values.AdditionalVideo ? (
                      <video
                        src={URL.createObjectURL(values.AdditionalVideo)}
                        controls
                        className="w-[90px] h-[60px] rounded-md"
                      >
                        <track
                          kind="captions"
                          src="path_to_captions.vtt"
                          srcLang="en"
                          label="English"
                        />
                      </video>
                    ) : null
                    // <img src={vediologo} alt="Default Logo" />
                  }
                  <p className="text-[14px] py-2 text-[#203F58]">
                    Drag and drop video here, or click add video
                  </p>
                  <div className="px-2 py-1 text-black bg-gray-400 rounded-md mt-3 hover:cursor-pointer">
                    Add Video
                  </div>
                  <input
                    type="file"
                    name="AdditionalVideo"
                    id="AdditionalVideo"
                    accept="video/*"
                    onChange={(event) =>
                      setFieldValue('AdditionalVideo', event.currentTarget.files[0])
                    }
                    className="w-full bg-gray-50 rounded-md p-2 mb-2 opacity-0"
                  />
                </div>
              </label>
            </div>
            <div className="flex justify-end m-4 mt-7">
              <button type="submit" className="text-white bg-black w-fit px-3 py-2 rounded-md">
                Save & Next
              </button>
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
}
