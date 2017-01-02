var carbon = require('carbon-io')
var o      = carbon.atom.o(module).main    // Note the .main here since this is the main application 
var __     = carbon.fibers.__(module).main // Note the .main here since this is the main application 

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
    description: "A service for managing zipcodes",

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
        collection: "zipcodes", 

        // The JSON schema objects managed by this endpoint must conform to. 
        schema: {
          type: "object",
          properties: {
            _id: { type: "string", pattern: "^[0-9]{5}$" },
            state: { type: "string", pattern: "^[A-Z]{2}$" },
          },
          required: ["_id", "state"],
          additionalProperties: false
        },

        // Set of operations that are enabled on this collection
        enabled: {
          insert: true,
          find: true,
          findObject: true,
          removeObject: true,
          '*': false, // Not strictly required but informative.
        },

        // Configuration for the find operation. We restrict to querying on 'state'.
        findConfig: {
          querySchema: {
            type: "object",
            properties: {
              state: { type: "string" }
            },
            required: ["state"],
            additionalProperties: false // This is important to disallow searching by other fields. 
          }
        }

      })
    }

  })
})
