var carbon = require('carbon-io')
var __     = carbon.fibers.__(module)
var _o     = carbon.bond._o(module)
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
     * environmentVariables
     */
    environmentVariables: {
      DB_URI: {
        help: "URI for the MongoDB database to connect to. Defaults to 'mongodb://localhost:27017/contacts'",
        required: false
      },
    },
    
    /***************************************************************************
     * port
     */
    port: 8888,

    /***************************************************************************
     * dbUri
     */
    dbUri: _o('env:DB_URI') || 'mongodb://localhost:27017/zipcodes',

    /***************************************************************************
     * endpoints
     */
    endpoints : {
      zipcodes: o({
        _type: carbon.carbond.mongodb.MongoDBCollection,

        // The name of the database collection this endpoint will expose.
        collectionName: 'zipcodes',

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
          removeObject: true,
          saveObject: true,
          '*': false, // Not strictly required but informative.
        },

        saveObjectConfig: {
          supportsUpsert: true,
        },

        // The query schema for find.
        querySchema: {
          type: 'object',
          properties: {
            state: { type: 'string' }
          },
          additionalProperties: false // This is important to disallow searching by other fields.
        }
      })
    }
  })
})
