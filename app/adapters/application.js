import RESTAdapter from 'ember-data/adapters/rest'
import service from 'ember-service/inject'
import {reads} from 'ember-computed'



export default RESTAdapter.extend({

  // ----- Services -----
  config: service(),



  // ----- Overridden properties -----
  host:      reads('config.contentApiHost'),
  namespace: reads('config.namespace'),



  // ----- Overridden methods -----
  urlForFindRecord (id, modelName, snapshot) {
    return this._super(id, modelName, snapshot) + '.json'
  },

  findRecord (store, type, id, snapshot) {
    return this
      ._super(store, type, id, snapshot)
      .then(response => ({...response, id}))
  }
})
