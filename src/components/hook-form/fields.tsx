import { RHFCode } from './rhf-code';
import { RHFRating } from './rhf-rating';
import { RHFEditor } from './rhf-editor';
import { RHFSlider } from './rhf-slider';
import { RHFTextField } from './rhf-text-field';
import { RHFRadioGroup } from './rhf-radio-group';
import { RHFPhoneInput } from './rhf-phone-input';
import { RHFAutocomplete } from './rhf-autocomplete';
import { RHFCountrySelect } from './rhf-country-select';
import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';
import { RHFCheckbox, RHFMultiCheckbox } from './rhf-checkbox';
import { GooglePlacesAutoComplete } from './GooglePlacesAutoComplete';
import { RHFSelect, RHFMultiSelect, RHFSingleSelect } from './rhf-select';
import { RHFDatePicker, RHFMobileDateTimePicker,RHFMobileTimePicker } from './rhf-date-picker';
import {
  RHFUpload,
  RHFUploadBox,
  RHFUploadAvatar,
  RHFUploadDocument,
  RHFUploadMultiVideo,
} from './rhf-upload';

// ----------------------------------------------------------------------

export const Field = {
  GooglePlacesAutoComplete,
  Code: RHFCode,
  Editor: RHFEditor,
  Select: RHFSelect,
  Upload: RHFUpload,
  Switch: RHFSwitch,
  Slider: RHFSlider,
  Rating: RHFRating,
  Text: RHFTextField,
  Phone: RHFPhoneInput,
  Checkbox: RHFCheckbox,
  UploadBox: RHFUploadBox,
  RadioGroup: RHFRadioGroup,
  DatePicker: RHFDatePicker,
  MultiSelect: RHFMultiSelect,
  MultiSwitch: RHFMultiSwitch,
  UploadAvatar: RHFUploadAvatar,
  Autocomplete: RHFAutocomplete,
  MultiCheckbox: RHFMultiCheckbox,
  CountrySelect: RHFCountrySelect,
  MobileDateTimePicker: RHFMobileDateTimePicker, 
  SingelSelect: RHFSingleSelect,
  MultiVideo: RHFUploadMultiVideo,
  UploadDocument: RHFUploadDocument,
  TimePicker: RHFMobileTimePicker,
};
