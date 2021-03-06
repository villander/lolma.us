import ApplicationSerializer from './application'
import _ from 'npm:lodash'
import {underscore} from 'ember-string'



export default ApplicationSerializer.extend({

  // ----- Overridden properties -----
  primaryKey: 'full_name',



  // ----- Overridden methods -----
  keyForAttribute (key, method) {
    return underscore(key)
  },

  normalize (primaryModelClass, payload)  {
    const newPayload = _.pick(payload, ['stargazers_count', 'full_name'])
    return this._super(primaryModelClass, newPayload)
  }
})
