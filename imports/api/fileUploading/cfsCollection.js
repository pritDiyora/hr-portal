switch (Meteor.absoluteUrl()) {
  case "http://localhost:3000/":
    fileUploadPath = "~/Desktop/HR-portal/images";
    break;
  case "http://localhost:5000/":
    fileUploadPath = "~/Desktop/HR-portal/images";
    break;
  default:
    fileUploadPath = '/root/HR-portal/image';
}

const Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", { path: fileUploadPath})],
  filter: {
    maxSize: 3145728,
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
    }
  }
});
Images.allow({
  'insert': function (userId, fileObj) {
    // add custom authentication code here
    return true;
  }, 
  'download': function (userId, fileObj) {
    // add custom authentication code here
    return true;
  }, 

});
export default Images;
