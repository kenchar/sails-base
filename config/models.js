module.exports.models = {

  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true, },
    createdBy: { model: 'user', },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
    updatedBy: { model: 'user', },
    id: { type: 'number', autoIncrement: true, },
  }

};
