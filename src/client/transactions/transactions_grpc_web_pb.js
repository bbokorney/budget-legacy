/**
 * @fileoverview gRPC-Web generated client stub for transactions
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.transactions = require('./transactions_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.transactions.TransactionsClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.transactions.TransactionsPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.transactions.Transaction,
 *   !proto.transactions.Reply>}
 */
const methodDescriptor_Transactions_AddTransaction = new grpc.web.MethodDescriptor(
  '/transactions.Transactions/AddTransaction',
  grpc.web.MethodType.UNARY,
  proto.transactions.Transaction,
  proto.transactions.Reply,
  /**
   * @param {!proto.transactions.Transaction} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.transactions.Reply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.transactions.Transaction,
 *   !proto.transactions.Reply>}
 */
const methodInfo_Transactions_AddTransaction = new grpc.web.AbstractClientBase.MethodInfo(
  proto.transactions.Reply,
  /**
   * @param {!proto.transactions.Transaction} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.transactions.Reply.deserializeBinary
);


/**
 * @param {!proto.transactions.Transaction} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.transactions.Reply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.transactions.Reply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.transactions.TransactionsClient.prototype.addTransaction =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/transactions.Transactions/AddTransaction',
      request,
      metadata || {},
      methodDescriptor_Transactions_AddTransaction,
      callback);
};


/**
 * @param {!proto.transactions.Transaction} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.transactions.Reply>}
 *     Promise that resolves to the response
 */
proto.transactions.TransactionsPromiseClient.prototype.addTransaction =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/transactions.Transactions/AddTransaction',
      request,
      metadata || {},
      methodDescriptor_Transactions_AddTransaction);
};


module.exports = proto.transactions;

