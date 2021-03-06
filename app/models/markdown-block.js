import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import {belongsTo} from 'ember-data/relationships'

export default Model.extend({

  // ----- Attributes -----
  title:   attr('string'),
  body:    attr('string'),



  // ----- Relationships -----
  website: belongsTo('markdown-block')
})
