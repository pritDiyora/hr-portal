import { FilesCollection } from 'meteor/ostrio:files';
import { tr } from 'date-fns/locale';
const Images = new FilesCollection({
  collectionName: 'Images',
  debug: true,
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  }
});

export default Images;
