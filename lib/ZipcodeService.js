var carbon = require('carbon-io')
var __     = carbon.fibers.__(module)
var o      = carbon.atom.o(module).main    // Note the .main here since this is the main application

/***************************************************************************************************
 * ZipcodeService
 *
 * A service for managing zipcodes.
 */
__(function() {
  module.exports = o({

    /***************************************************************************
     * _type
     */
    _type: carbon.carbond.Service,
    
    /***************************************************************************
     * description
     */
    description: 'A service for managing zipcodes',

    /***************************************************************************
     * port
     */
    port: 8888,

    /***************************************************************************
     * dbUri
     */
    dbUri: 'mongodb://localhost:27017/zipcodes',

    /***************************************************************************
     * endpoints
     */
    endpoints : {
      zipcodes: o({
        _type: carbon.carbond.mongodb.MongoDBCollection,

        // The name of the database collection this endpoint will expose.
        collection: 'zipcodes',

        // The JSON schema objects managed by this endpoint must conform to.
        schema: {
          type: 'object',
          properties: {
            _id: { type: 'string', pattern: '^[0-9]{5}$' },
            state: { type: 'string', pattern: '^[A-Z]{2}$' },
          },
          required: ['_id', 'state'],
          additionalProperties: false
        },

        // Set of operations that are enabled on this collection.
        enabled: {
          find: true,
          findObject: true,
          insertObject: true,
          removeObject: true,
          '*': false, // Not strictly required but informative.
        },

        // The query schema for find.
        querySchema: {
          type: 'object',
          properties: {
            state: { type: 'string' }
          },
          additionalProperties: false // This is important to disallow searching by other fields.
        }

        // Set insertObjectConfig so that it accepts a zip and a state. We'll generate an _id from the zip parameter.
        insertObjectConfig: {
          insertObjectSchema: {
            type: 'object',
            properties: {
              zip: { type: 'string', pattern: '^[0-9]{5}$' },
              state: { type: 'string', pattern: '^[A-Z]{2}$' },
            },
            required: ['zip', 'state'],
            additionalProperties: false
          }
        },

        // generateId is called before insertObject. We use it to set the _id to the zip parameter.
        idGenerator: {
          generateId(collection, request) {
            return request.body.zip
          }
        },

        insertObject(object, context, options) {
          // generateId has created the object._id parameter and set it equal to object.zip. We can now delete object.zip so it matches the collection schema.
          delete object.zip
          return this._db.getCollection(this.collection).insertObject(object, options)
        },
      })
    }
  })
})
