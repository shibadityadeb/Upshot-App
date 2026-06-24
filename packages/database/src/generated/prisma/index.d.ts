
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Profile
 * 
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model Company
 * 
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model EventRequirement
 * 
 */
export type EventRequirement = $Result.DefaultSelection<Prisma.$EventRequirementPayload>
/**
 * Model EventApplication
 * 
 */
export type EventApplication = $Result.DefaultSelection<Prisma.$EventApplicationPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model WalletBalance
 * 
 */
export type WalletBalance = $Result.DefaultSelection<Prisma.$WalletBalancePayload>
/**
 * Model CoinTransaction
 * 
 */
export type CoinTransaction = $Result.DefaultSelection<Prisma.$CoinTransactionPayload>
/**
 * Model Ambassador
 * 
 */
export type Ambassador = $Result.DefaultSelection<Prisma.$AmbassadorPayload>
/**
 * Model Student
 * 
 */
export type Student = $Result.DefaultSelection<Prisma.$StudentPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  admin: 'admin',
  company: 'company',
  people: 'people',
  ambassador: 'ambassador',
  student: 'student'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const EventStatus: {
  draft: 'draft',
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  completed: 'completed',
  cancelled: 'cancelled'
};

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus]


export const ApplicationStatus: {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  withdrawn: 'withdrawn'
};

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus]


export const TaskStatus: {
  assigned: 'assigned',
  in_progress: 'in_progress',
  submitted: 'submitted',
  approved: 'approved',
  rejected: 'rejected'
};

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]


export const TransactionType: {
  earned: 'earned',
  redeemed: 'redeemed',
  bonus: 'bonus',
  penalty: 'penalty'
};

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]


export const AmbassadorTier: {
  bronze: 'bronze',
  silver: 'silver',
  gold: 'gold',
  platinum: 'platinum'
};

export type AmbassadorTier = (typeof AmbassadorTier)[keyof typeof AmbassadorTier]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type EventStatus = $Enums.EventStatus

export const EventStatus: typeof $Enums.EventStatus

export type ApplicationStatus = $Enums.ApplicationStatus

export const ApplicationStatus: typeof $Enums.ApplicationStatus

export type TaskStatus = $Enums.TaskStatus

export const TaskStatus: typeof $Enums.TaskStatus

export type TransactionType = $Enums.TransactionType

export const TransactionType: typeof $Enums.TransactionType

export type AmbassadorTier = $Enums.AmbassadorTier

export const AmbassadorTier: typeof $Enums.AmbassadorTier

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profile.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs>;

  /**
   * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
  get company(): Prisma.CompanyDelegate<ExtArgs>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs>;

  /**
   * `prisma.eventRequirement`: Exposes CRUD operations for the **EventRequirement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventRequirements
    * const eventRequirements = await prisma.eventRequirement.findMany()
    * ```
    */
  get eventRequirement(): Prisma.EventRequirementDelegate<ExtArgs>;

  /**
   * `prisma.eventApplication`: Exposes CRUD operations for the **EventApplication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventApplications
    * const eventApplications = await prisma.eventApplication.findMany()
    * ```
    */
  get eventApplication(): Prisma.EventApplicationDelegate<ExtArgs>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs>;

  /**
   * `prisma.walletBalance`: Exposes CRUD operations for the **WalletBalance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WalletBalances
    * const walletBalances = await prisma.walletBalance.findMany()
    * ```
    */
  get walletBalance(): Prisma.WalletBalanceDelegate<ExtArgs>;

  /**
   * `prisma.coinTransaction`: Exposes CRUD operations for the **CoinTransaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CoinTransactions
    * const coinTransactions = await prisma.coinTransaction.findMany()
    * ```
    */
  get coinTransaction(): Prisma.CoinTransactionDelegate<ExtArgs>;

  /**
   * `prisma.ambassador`: Exposes CRUD operations for the **Ambassador** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ambassadors
    * const ambassadors = await prisma.ambassador.findMany()
    * ```
    */
  get ambassador(): Prisma.AmbassadorDelegate<ExtArgs>;

  /**
   * `prisma.student`: Exposes CRUD operations for the **Student** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Students
    * const students = await prisma.student.findMany()
    * ```
    */
  get student(): Prisma.StudentDelegate<ExtArgs>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Profile: 'Profile',
    Company: 'Company',
    Event: 'Event',
    EventRequirement: 'EventRequirement',
    EventApplication: 'EventApplication',
    Task: 'Task',
    WalletBalance: 'WalletBalance',
    CoinTransaction: 'CoinTransaction',
    Ambassador: 'Ambassador',
    Student: 'Student',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "profile" | "company" | "event" | "eventRequirement" | "eventApplication" | "task" | "walletBalance" | "coinTransaction" | "ambassador" | "student" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      Company: {
        payload: Prisma.$CompanyPayload<ExtArgs>
        fields: Prisma.CompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findFirst: {
            args: Prisma.CompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findMany: {
            args: Prisma.CompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          create: {
            args: Prisma.CompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          createMany: {
            args: Prisma.CompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          delete: {
            args: Prisma.CompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          update: {
            args: Prisma.CompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          deleteMany: {
            args: Prisma.CompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          aggregate: {
            args: Prisma.CompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompany>
          }
          groupBy: {
            args: Prisma.CompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      EventRequirement: {
        payload: Prisma.$EventRequirementPayload<ExtArgs>
        fields: Prisma.EventRequirementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventRequirementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventRequirementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload>
          }
          findFirst: {
            args: Prisma.EventRequirementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventRequirementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload>
          }
          findMany: {
            args: Prisma.EventRequirementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload>[]
          }
          create: {
            args: Prisma.EventRequirementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload>
          }
          createMany: {
            args: Prisma.EventRequirementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventRequirementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload>[]
          }
          delete: {
            args: Prisma.EventRequirementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload>
          }
          update: {
            args: Prisma.EventRequirementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload>
          }
          deleteMany: {
            args: Prisma.EventRequirementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventRequirementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventRequirementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventRequirementPayload>
          }
          aggregate: {
            args: Prisma.EventRequirementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventRequirement>
          }
          groupBy: {
            args: Prisma.EventRequirementGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventRequirementGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventRequirementCountArgs<ExtArgs>
            result: $Utils.Optional<EventRequirementCountAggregateOutputType> | number
          }
        }
      }
      EventApplication: {
        payload: Prisma.$EventApplicationPayload<ExtArgs>
        fields: Prisma.EventApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload>
          }
          findFirst: {
            args: Prisma.EventApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload>
          }
          findMany: {
            args: Prisma.EventApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload>[]
          }
          create: {
            args: Prisma.EventApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload>
          }
          createMany: {
            args: Prisma.EventApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload>[]
          }
          delete: {
            args: Prisma.EventApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload>
          }
          update: {
            args: Prisma.EventApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload>
          }
          deleteMany: {
            args: Prisma.EventApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventApplicationPayload>
          }
          aggregate: {
            args: Prisma.EventApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventApplication>
          }
          groupBy: {
            args: Prisma.EventApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<EventApplicationCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      WalletBalance: {
        payload: Prisma.$WalletBalancePayload<ExtArgs>
        fields: Prisma.WalletBalanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WalletBalanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WalletBalanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          findFirst: {
            args: Prisma.WalletBalanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WalletBalanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          findMany: {
            args: Prisma.WalletBalanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>[]
          }
          create: {
            args: Prisma.WalletBalanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          createMany: {
            args: Prisma.WalletBalanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WalletBalanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>[]
          }
          delete: {
            args: Prisma.WalletBalanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          update: {
            args: Prisma.WalletBalanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          deleteMany: {
            args: Prisma.WalletBalanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WalletBalanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WalletBalanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletBalancePayload>
          }
          aggregate: {
            args: Prisma.WalletBalanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWalletBalance>
          }
          groupBy: {
            args: Prisma.WalletBalanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<WalletBalanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.WalletBalanceCountArgs<ExtArgs>
            result: $Utils.Optional<WalletBalanceCountAggregateOutputType> | number
          }
        }
      }
      CoinTransaction: {
        payload: Prisma.$CoinTransactionPayload<ExtArgs>
        fields: Prisma.CoinTransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CoinTransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CoinTransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload>
          }
          findFirst: {
            args: Prisma.CoinTransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CoinTransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload>
          }
          findMany: {
            args: Prisma.CoinTransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload>[]
          }
          create: {
            args: Prisma.CoinTransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload>
          }
          createMany: {
            args: Prisma.CoinTransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CoinTransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload>[]
          }
          delete: {
            args: Prisma.CoinTransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload>
          }
          update: {
            args: Prisma.CoinTransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload>
          }
          deleteMany: {
            args: Prisma.CoinTransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CoinTransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CoinTransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoinTransactionPayload>
          }
          aggregate: {
            args: Prisma.CoinTransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCoinTransaction>
          }
          groupBy: {
            args: Prisma.CoinTransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CoinTransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CoinTransactionCountArgs<ExtArgs>
            result: $Utils.Optional<CoinTransactionCountAggregateOutputType> | number
          }
        }
      }
      Ambassador: {
        payload: Prisma.$AmbassadorPayload<ExtArgs>
        fields: Prisma.AmbassadorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AmbassadorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AmbassadorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload>
          }
          findFirst: {
            args: Prisma.AmbassadorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AmbassadorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload>
          }
          findMany: {
            args: Prisma.AmbassadorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload>[]
          }
          create: {
            args: Prisma.AmbassadorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload>
          }
          createMany: {
            args: Prisma.AmbassadorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AmbassadorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload>[]
          }
          delete: {
            args: Prisma.AmbassadorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload>
          }
          update: {
            args: Prisma.AmbassadorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload>
          }
          deleteMany: {
            args: Prisma.AmbassadorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AmbassadorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AmbassadorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmbassadorPayload>
          }
          aggregate: {
            args: Prisma.AmbassadorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAmbassador>
          }
          groupBy: {
            args: Prisma.AmbassadorGroupByArgs<ExtArgs>
            result: $Utils.Optional<AmbassadorGroupByOutputType>[]
          }
          count: {
            args: Prisma.AmbassadorCountArgs<ExtArgs>
            result: $Utils.Optional<AmbassadorCountAggregateOutputType> | number
          }
        }
      }
      Student: {
        payload: Prisma.$StudentPayload<ExtArgs>
        fields: Prisma.StudentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findFirst: {
            args: Prisma.StudentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findMany: {
            args: Prisma.StudentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          create: {
            args: Prisma.StudentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          createMany: {
            args: Prisma.StudentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          delete: {
            args: Prisma.StudentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          update: {
            args: Prisma.StudentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          deleteMany: {
            args: Prisma.StudentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StudentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          aggregate: {
            args: Prisma.StudentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudent>
          }
          groupBy: {
            args: Prisma.StudentGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentCountArgs<ExtArgs>
            result: $Utils.Optional<StudentCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProfileCountOutputType
   */

  export type ProfileCountOutputType = {
    companiesOwned: number
    eventsCreated: number
    eventsApproved: number
    eventApplications: number
    reviewedApplications: number
    tasksAssigned: number
    tasksCreated: number
    coinTransactions: number
    notifications: number
  }

  export type ProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    companiesOwned?: boolean | ProfileCountOutputTypeCountCompaniesOwnedArgs
    eventsCreated?: boolean | ProfileCountOutputTypeCountEventsCreatedArgs
    eventsApproved?: boolean | ProfileCountOutputTypeCountEventsApprovedArgs
    eventApplications?: boolean | ProfileCountOutputTypeCountEventApplicationsArgs
    reviewedApplications?: boolean | ProfileCountOutputTypeCountReviewedApplicationsArgs
    tasksAssigned?: boolean | ProfileCountOutputTypeCountTasksAssignedArgs
    tasksCreated?: boolean | ProfileCountOutputTypeCountTasksCreatedArgs
    coinTransactions?: boolean | ProfileCountOutputTypeCountCoinTransactionsArgs
    notifications?: boolean | ProfileCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileCountOutputType
     */
    select?: ProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountCompaniesOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountEventsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountEventsApprovedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountEventApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventApplicationWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountReviewedApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventApplicationWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountTasksAssignedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountTasksCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountCoinTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CoinTransactionWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    events: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | CompanyCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyCountOutputType
     */
    select?: CompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }


  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    requirements_list: number
    applications: number
    tasks: number
  }

  export type EventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requirements_list?: boolean | EventCountOutputTypeCountRequirements_listArgs
    applications?: boolean | EventCountOutputTypeCountApplicationsArgs
    tasks?: boolean | EventCountOutputTypeCountTasksArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountRequirements_listArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventRequirementWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventApplicationWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }


  /**
   * Count Type AmbassadorCountOutputType
   */

  export type AmbassadorCountOutputType = {
    students: number
  }

  export type AmbassadorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    students?: boolean | AmbassadorCountOutputTypeCountStudentsArgs
  }

  // Custom InputTypes
  /**
   * AmbassadorCountOutputType without action
   */
  export type AmbassadorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmbassadorCountOutputType
     */
    select?: AmbassadorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AmbassadorCountOutputType without action
   */
  export type AmbassadorCountOutputTypeCountStudentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    email: string | null
    fullName: string | null
    avatarUrl: string | null
    role: $Enums.UserRole | null
    phone: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    email: string | null
    fullName: string | null
    avatarUrl: string | null
    role: $Enums.UserRole | null
    phone: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    email: number
    fullName: number
    avatarUrl: number
    role: number
    phone: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProfileMinAggregateInputType = {
    id?: true
    email?: true
    fullName?: true
    avatarUrl?: true
    role?: true
    phone?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    email?: true
    fullName?: true
    avatarUrl?: true
    role?: true
    phone?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    email?: true
    fullName?: true
    avatarUrl?: true
    role?: true
    phone?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    email: string
    fullName: string
    avatarUrl: string | null
    role: $Enums.UserRole
    phone: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    fullName?: boolean
    avatarUrl?: boolean
    role?: boolean
    phone?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    companiesOwned?: boolean | Profile$companiesOwnedArgs<ExtArgs>
    eventsCreated?: boolean | Profile$eventsCreatedArgs<ExtArgs>
    eventsApproved?: boolean | Profile$eventsApprovedArgs<ExtArgs>
    eventApplications?: boolean | Profile$eventApplicationsArgs<ExtArgs>
    reviewedApplications?: boolean | Profile$reviewedApplicationsArgs<ExtArgs>
    tasksAssigned?: boolean | Profile$tasksAssignedArgs<ExtArgs>
    tasksCreated?: boolean | Profile$tasksCreatedArgs<ExtArgs>
    coinTransactions?: boolean | Profile$coinTransactionsArgs<ExtArgs>
    walletBalance?: boolean | Profile$walletBalanceArgs<ExtArgs>
    ambassador?: boolean | Profile$ambassadorArgs<ExtArgs>
    student?: boolean | Profile$studentArgs<ExtArgs>
    notifications?: boolean | Profile$notificationsArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    fullName?: boolean
    avatarUrl?: boolean
    role?: boolean
    phone?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectScalar = {
    id?: boolean
    email?: boolean
    fullName?: boolean
    avatarUrl?: boolean
    role?: boolean
    phone?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    companiesOwned?: boolean | Profile$companiesOwnedArgs<ExtArgs>
    eventsCreated?: boolean | Profile$eventsCreatedArgs<ExtArgs>
    eventsApproved?: boolean | Profile$eventsApprovedArgs<ExtArgs>
    eventApplications?: boolean | Profile$eventApplicationsArgs<ExtArgs>
    reviewedApplications?: boolean | Profile$reviewedApplicationsArgs<ExtArgs>
    tasksAssigned?: boolean | Profile$tasksAssignedArgs<ExtArgs>
    tasksCreated?: boolean | Profile$tasksCreatedArgs<ExtArgs>
    coinTransactions?: boolean | Profile$coinTransactionsArgs<ExtArgs>
    walletBalance?: boolean | Profile$walletBalanceArgs<ExtArgs>
    ambassador?: boolean | Profile$ambassadorArgs<ExtArgs>
    student?: boolean | Profile$studentArgs<ExtArgs>
    notifications?: boolean | Profile$notificationsArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      companiesOwned: Prisma.$CompanyPayload<ExtArgs>[]
      eventsCreated: Prisma.$EventPayload<ExtArgs>[]
      eventsApproved: Prisma.$EventPayload<ExtArgs>[]
      eventApplications: Prisma.$EventApplicationPayload<ExtArgs>[]
      reviewedApplications: Prisma.$EventApplicationPayload<ExtArgs>[]
      tasksAssigned: Prisma.$TaskPayload<ExtArgs>[]
      tasksCreated: Prisma.$TaskPayload<ExtArgs>[]
      coinTransactions: Prisma.$CoinTransactionPayload<ExtArgs>[]
      walletBalance: Prisma.$WalletBalancePayload<ExtArgs> | null
      ambassador: Prisma.$AmbassadorPayload<ExtArgs> | null
      student: Prisma.$StudentPayload<ExtArgs> | null
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      fullName: string
      avatarUrl: string | null
      role: $Enums.UserRole
      phone: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    companiesOwned<T extends Profile$companiesOwnedArgs<ExtArgs> = {}>(args?: Subset<T, Profile$companiesOwnedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany"> | Null>
    eventsCreated<T extends Profile$eventsCreatedArgs<ExtArgs> = {}>(args?: Subset<T, Profile$eventsCreatedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany"> | Null>
    eventsApproved<T extends Profile$eventsApprovedArgs<ExtArgs> = {}>(args?: Subset<T, Profile$eventsApprovedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany"> | Null>
    eventApplications<T extends Profile$eventApplicationsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$eventApplicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "findMany"> | Null>
    reviewedApplications<T extends Profile$reviewedApplicationsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$reviewedApplicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "findMany"> | Null>
    tasksAssigned<T extends Profile$tasksAssignedArgs<ExtArgs> = {}>(args?: Subset<T, Profile$tasksAssignedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    tasksCreated<T extends Profile$tasksCreatedArgs<ExtArgs> = {}>(args?: Subset<T, Profile$tasksCreatedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    coinTransactions<T extends Profile$coinTransactionsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$coinTransactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "findMany"> | Null>
    walletBalance<T extends Profile$walletBalanceArgs<ExtArgs> = {}>(args?: Subset<T, Profile$walletBalanceArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    ambassador<T extends Profile$ambassadorArgs<ExtArgs> = {}>(args?: Subset<T, Profile$ambassadorArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    student<T extends Profile$studentArgs<ExtArgs> = {}>(args?: Subset<T, Profile$studentArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    notifications<T extends Profile$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Profile model
   */ 
  interface ProfileFieldRefs {
    readonly id: FieldRef<"Profile", 'String'>
    readonly email: FieldRef<"Profile", 'String'>
    readonly fullName: FieldRef<"Profile", 'String'>
    readonly avatarUrl: FieldRef<"Profile", 'String'>
    readonly role: FieldRef<"Profile", 'UserRole'>
    readonly phone: FieldRef<"Profile", 'String'>
    readonly isActive: FieldRef<"Profile", 'Boolean'>
    readonly createdAt: FieldRef<"Profile", 'DateTime'>
    readonly updatedAt: FieldRef<"Profile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
  }

  /**
   * Profile.companiesOwned
   */
  export type Profile$companiesOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    cursor?: CompanyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Profile.eventsCreated
   */
  export type Profile$eventsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Profile.eventsApproved
   */
  export type Profile$eventsApprovedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Profile.eventApplications
   */
  export type Profile$eventApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    where?: EventApplicationWhereInput
    orderBy?: EventApplicationOrderByWithRelationInput | EventApplicationOrderByWithRelationInput[]
    cursor?: EventApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventApplicationScalarFieldEnum | EventApplicationScalarFieldEnum[]
  }

  /**
   * Profile.reviewedApplications
   */
  export type Profile$reviewedApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    where?: EventApplicationWhereInput
    orderBy?: EventApplicationOrderByWithRelationInput | EventApplicationOrderByWithRelationInput[]
    cursor?: EventApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventApplicationScalarFieldEnum | EventApplicationScalarFieldEnum[]
  }

  /**
   * Profile.tasksAssigned
   */
  export type Profile$tasksAssignedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Profile.tasksCreated
   */
  export type Profile$tasksCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Profile.coinTransactions
   */
  export type Profile$coinTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    where?: CoinTransactionWhereInput
    orderBy?: CoinTransactionOrderByWithRelationInput | CoinTransactionOrderByWithRelationInput[]
    cursor?: CoinTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CoinTransactionScalarFieldEnum | CoinTransactionScalarFieldEnum[]
  }

  /**
   * Profile.walletBalance
   */
  export type Profile$walletBalanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    where?: WalletBalanceWhereInput
  }

  /**
   * Profile.ambassador
   */
  export type Profile$ambassadorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    where?: AmbassadorWhereInput
  }

  /**
   * Profile.student
   */
  export type Profile$studentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
  }

  /**
   * Profile.notifications
   */
  export type Profile$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyMinAggregateOutputType = {
    id: string | null
    name: string | null
    logoUrl: string | null
    website: string | null
    industry: string | null
    description: string | null
    contactPersonId: string | null
    isVerified: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    logoUrl: string | null
    website: string | null
    industry: string | null
    description: string | null
    contactPersonId: string | null
    isVerified: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyCountAggregateOutputType = {
    id: number
    name: number
    logoUrl: number
    website: number
    industry: number
    description: number
    contactPersonId: number
    isVerified: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CompanyMinAggregateInputType = {
    id?: true
    name?: true
    logoUrl?: true
    website?: true
    industry?: true
    description?: true
    contactPersonId?: true
    isVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyMaxAggregateInputType = {
    id?: true
    name?: true
    logoUrl?: true
    website?: true
    industry?: true
    description?: true
    contactPersonId?: true
    isVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyCountAggregateInputType = {
    id?: true
    name?: true
    logoUrl?: true
    website?: true
    industry?: true
    description?: true
    contactPersonId?: true
    isVerified?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Company to aggregate.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Companies
    **/
    _count?: true | CompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMaxAggregateInputType
  }

  export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany[P]>
      : GetScalarType<T[P], AggregateCompany[P]>
  }




  export type CompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[]
    by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum
    having?: CompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyCountAggregateInputType | true
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    id: string
    name: string
    logoUrl: string | null
    website: string | null
    industry: string | null
    description: string | null
    contactPersonId: string
    isVerified: boolean
    createdAt: Date
    updatedAt: Date
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyGroupByOutputType[P]>
        }
      >
    >


  export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    logoUrl?: boolean
    website?: boolean
    industry?: boolean
    description?: boolean
    contactPersonId?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contactPerson?: boolean | ProfileDefaultArgs<ExtArgs>
    events?: boolean | Company$eventsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    logoUrl?: boolean
    website?: boolean
    industry?: boolean
    description?: boolean
    contactPersonId?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contactPerson?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectScalar = {
    id?: boolean
    name?: boolean
    logoUrl?: boolean
    website?: boolean
    industry?: boolean
    description?: boolean
    contactPersonId?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contactPerson?: boolean | ProfileDefaultArgs<ExtArgs>
    events?: boolean | Company$eventsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contactPerson?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      contactPerson: Prisma.$ProfilePayload<ExtArgs>
      events: Prisma.$EventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      logoUrl: string | null
      website: string | null
      industry: string | null
      description: string | null
      contactPersonId: string
      isVerified: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["company"]>
    composites: {}
  }

  type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = $Result.GetResult<Prisma.$CompanyPayload, S>

  type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CompanyCountAggregateInputType | true
    }

  export interface CompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Company'], meta: { name: 'Company' } }
    /**
     * Find zero or one Company that matches the filter.
     * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyFindUniqueArgs>(args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Company that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Company that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyFindFirstArgs>(args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Company that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.company.findMany()
     * 
     * // Get first 10 Companies
     * const companies = await prisma.company.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyWithIdOnly = await prisma.company.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyFindManyArgs>(args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Company.
     * @param {CompanyCreateArgs} args - Arguments to create a Company.
     * @example
     * // Create one Company
     * const Company = await prisma.company.create({
     *   data: {
     *     // ... data to create a Company
     *   }
     * })
     * 
     */
    create<T extends CompanyCreateArgs>(args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Companies.
     * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyCreateManyArgs>(args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Companies and returns the data saved in the database.
     * @param {CompanyCreateManyAndReturnArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Company.
     * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
     * @example
     * // Delete one Company
     * const Company = await prisma.company.delete({
     *   where: {
     *     // ... filter to delete one Company
     *   }
     * })
     * 
     */
    delete<T extends CompanyDeleteArgs>(args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Company.
     * @param {CompanyUpdateArgs} args - Arguments to update one Company.
     * @example
     * // Update one Company
     * const company = await prisma.company.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyUpdateArgs>(args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Companies.
     * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.company.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyDeleteManyArgs>(args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyUpdateManyArgs>(args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Company.
     * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
     * @example
     * // Update or create a Company
     * const company = await prisma.company.upsert({
     *   create: {
     *     // ... data to create a Company
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company we want to update
     *   }
     * })
     */
    upsert<T extends CompanyUpsertArgs>(args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.company.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
    **/
    count<T extends CompanyCountArgs>(
      args?: Subset<T, CompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanyAggregateArgs>(args: Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>

    /**
     * Group by Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyGroupByArgs['orderBy'] }
        : { orderBy?: CompanyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Company model
   */
  readonly fields: CompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Company.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contactPerson<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    events<T extends Company$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Company$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Company model
   */ 
  interface CompanyFieldRefs {
    readonly id: FieldRef<"Company", 'String'>
    readonly name: FieldRef<"Company", 'String'>
    readonly logoUrl: FieldRef<"Company", 'String'>
    readonly website: FieldRef<"Company", 'String'>
    readonly industry: FieldRef<"Company", 'String'>
    readonly description: FieldRef<"Company", 'String'>
    readonly contactPersonId: FieldRef<"Company", 'String'>
    readonly isVerified: FieldRef<"Company", 'Boolean'>
    readonly createdAt: FieldRef<"Company", 'DateTime'>
    readonly updatedAt: FieldRef<"Company", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Company findUnique
   */
  export type CompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findUniqueOrThrow
   */
  export type CompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findFirst
   */
  export type CompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findFirstOrThrow
   */
  export type CompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findMany
   */
  export type CompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Companies to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company create
   */
  export type CompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Company.
     */
    data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
  }

  /**
   * Company createMany
   */
  export type CompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company createManyAndReturn
   */
  export type CompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Company update
   */
  export type CompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Company.
     */
    data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
    /**
     * Choose, which Company to update.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company updateMany
   */
  export type CompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
  }

  /**
   * Company upsert
   */
  export type CompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Company to update in case it exists.
     */
    where: CompanyWhereUniqueInput
    /**
     * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
     */
    create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
    /**
     * In case the Company was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
  }

  /**
   * Company delete
   */
  export type CompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter which Company to delete.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company deleteMany
   */
  export type CompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Companies to delete
     */
    where?: CompanyWhereInput
  }

  /**
   * Company.events
   */
  export type Company$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Company without action
   */
  export type CompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    maxAttendees: number | null
    currentAttendees: number | null
    coinReward: number | null
  }

  export type EventSumAggregateOutputType = {
    maxAttendees: number | null
    currentAttendees: number | null
    coinReward: number | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    companyId: string | null
    eventDate: Date | null
    eventTime: Date | null
    location: string | null
    locationUrl: string | null
    category: string | null
    bannerUrl: string | null
    maxAttendees: number | null
    currentAttendees: number | null
    status: $Enums.EventStatus | null
    requirements: string | null
    coinReward: number | null
    createdBy: string | null
    approvedBy: string | null
    approvedAt: Date | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    companyId: string | null
    eventDate: Date | null
    eventTime: Date | null
    location: string | null
    locationUrl: string | null
    category: string | null
    bannerUrl: string | null
    maxAttendees: number | null
    currentAttendees: number | null
    status: $Enums.EventStatus | null
    requirements: string | null
    coinReward: number | null
    createdBy: string | null
    approvedBy: string | null
    approvedAt: Date | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    title: number
    description: number
    companyId: number
    eventDate: number
    eventTime: number
    location: number
    locationUrl: number
    category: number
    bannerUrl: number
    maxAttendees: number
    currentAttendees: number
    status: number
    requirements: number
    coinReward: number
    createdBy: number
    approvedBy: number
    approvedAt: number
    rejectionReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    maxAttendees?: true
    currentAttendees?: true
    coinReward?: true
  }

  export type EventSumAggregateInputType = {
    maxAttendees?: true
    currentAttendees?: true
    coinReward?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    companyId?: true
    eventDate?: true
    eventTime?: true
    location?: true
    locationUrl?: true
    category?: true
    bannerUrl?: true
    maxAttendees?: true
    currentAttendees?: true
    status?: true
    requirements?: true
    coinReward?: true
    createdBy?: true
    approvedBy?: true
    approvedAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    companyId?: true
    eventDate?: true
    eventTime?: true
    location?: true
    locationUrl?: true
    category?: true
    bannerUrl?: true
    maxAttendees?: true
    currentAttendees?: true
    status?: true
    requirements?: true
    coinReward?: true
    createdBy?: true
    approvedBy?: true
    approvedAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    companyId?: true
    eventDate?: true
    eventTime?: true
    location?: true
    locationUrl?: true
    category?: true
    bannerUrl?: true
    maxAttendees?: true
    currentAttendees?: true
    status?: true
    requirements?: true
    coinReward?: true
    createdBy?: true
    approvedBy?: true
    approvedAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    title: string
    description: string
    companyId: string
    eventDate: Date
    eventTime: Date | null
    location: string
    locationUrl: string | null
    category: string
    bannerUrl: string | null
    maxAttendees: number | null
    currentAttendees: number
    status: $Enums.EventStatus
    requirements: string | null
    coinReward: number
    createdBy: string
    approvedBy: string | null
    approvedAt: Date | null
    rejectionReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    companyId?: boolean
    eventDate?: boolean
    eventTime?: boolean
    location?: boolean
    locationUrl?: boolean
    category?: boolean
    bannerUrl?: boolean
    maxAttendees?: boolean
    currentAttendees?: boolean
    status?: boolean
    requirements?: boolean
    coinReward?: boolean
    createdBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
    approver?: boolean | Event$approverArgs<ExtArgs>
    requirements_list?: boolean | Event$requirements_listArgs<ExtArgs>
    applications?: boolean | Event$applicationsArgs<ExtArgs>
    tasks?: boolean | Event$tasksArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    companyId?: boolean
    eventDate?: boolean
    eventTime?: boolean
    location?: boolean
    locationUrl?: boolean
    category?: boolean
    bannerUrl?: boolean
    maxAttendees?: boolean
    currentAttendees?: boolean
    status?: boolean
    requirements?: boolean
    coinReward?: boolean
    createdBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
    approver?: boolean | Event$approverArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    companyId?: boolean
    eventDate?: boolean
    eventTime?: boolean
    location?: boolean
    locationUrl?: boolean
    category?: boolean
    bannerUrl?: boolean
    maxAttendees?: boolean
    currentAttendees?: boolean
    status?: boolean
    requirements?: boolean
    coinReward?: boolean
    createdBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
    approver?: boolean | Event$approverArgs<ExtArgs>
    requirements_list?: boolean | Event$requirements_listArgs<ExtArgs>
    applications?: boolean | Event$applicationsArgs<ExtArgs>
    tasks?: boolean | Event$tasksArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
    approver?: boolean | Event$approverArgs<ExtArgs>
  }

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      creator: Prisma.$ProfilePayload<ExtArgs>
      approver: Prisma.$ProfilePayload<ExtArgs> | null
      requirements_list: Prisma.$EventRequirementPayload<ExtArgs>[]
      applications: Prisma.$EventApplicationPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      companyId: string
      eventDate: Date
      eventTime: Date | null
      location: string
      locationUrl: string | null
      category: string
      bannerUrl: string | null
      maxAttendees: number | null
      currentAttendees: number
      status: $Enums.EventStatus
      requirements: string | null
      coinReward: number
      createdBy: string
      approvedBy: string | null
      approvedAt: Date | null
      rejectionReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    creator<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    approver<T extends Event$approverArgs<ExtArgs> = {}>(args?: Subset<T, Event$approverArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    requirements_list<T extends Event$requirements_listArgs<ExtArgs> = {}>(args?: Subset<T, Event$requirements_listArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "findMany"> | Null>
    applications<T extends Event$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Event$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "findMany"> | Null>
    tasks<T extends Event$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Event$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */ 
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'String'>
    readonly title: FieldRef<"Event", 'String'>
    readonly description: FieldRef<"Event", 'String'>
    readonly companyId: FieldRef<"Event", 'String'>
    readonly eventDate: FieldRef<"Event", 'DateTime'>
    readonly eventTime: FieldRef<"Event", 'DateTime'>
    readonly location: FieldRef<"Event", 'String'>
    readonly locationUrl: FieldRef<"Event", 'String'>
    readonly category: FieldRef<"Event", 'String'>
    readonly bannerUrl: FieldRef<"Event", 'String'>
    readonly maxAttendees: FieldRef<"Event", 'Int'>
    readonly currentAttendees: FieldRef<"Event", 'Int'>
    readonly status: FieldRef<"Event", 'EventStatus'>
    readonly requirements: FieldRef<"Event", 'String'>
    readonly coinReward: FieldRef<"Event", 'Int'>
    readonly createdBy: FieldRef<"Event", 'String'>
    readonly approvedBy: FieldRef<"Event", 'String'>
    readonly approvedAt: FieldRef<"Event", 'DateTime'>
    readonly rejectionReason: FieldRef<"Event", 'String'>
    readonly createdAt: FieldRef<"Event", 'DateTime'>
    readonly updatedAt: FieldRef<"Event", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
  }

  /**
   * Event.approver
   */
  export type Event$approverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * Event.requirements_list
   */
  export type Event$requirements_listArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    where?: EventRequirementWhereInput
    orderBy?: EventRequirementOrderByWithRelationInput | EventRequirementOrderByWithRelationInput[]
    cursor?: EventRequirementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventRequirementScalarFieldEnum | EventRequirementScalarFieldEnum[]
  }

  /**
   * Event.applications
   */
  export type Event$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    where?: EventApplicationWhereInput
    orderBy?: EventApplicationOrderByWithRelationInput | EventApplicationOrderByWithRelationInput[]
    cursor?: EventApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventApplicationScalarFieldEnum | EventApplicationScalarFieldEnum[]
  }

  /**
   * Event.tasks
   */
  export type Event$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model EventRequirement
   */

  export type AggregateEventRequirement = {
    _count: EventRequirementCountAggregateOutputType | null
    _min: EventRequirementMinAggregateOutputType | null
    _max: EventRequirementMaxAggregateOutputType | null
  }

  export type EventRequirementMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    label: string | null
    createdAt: Date | null
  }

  export type EventRequirementMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    label: string | null
    createdAt: Date | null
  }

  export type EventRequirementCountAggregateOutputType = {
    id: number
    eventId: number
    label: number
    createdAt: number
    _all: number
  }


  export type EventRequirementMinAggregateInputType = {
    id?: true
    eventId?: true
    label?: true
    createdAt?: true
  }

  export type EventRequirementMaxAggregateInputType = {
    id?: true
    eventId?: true
    label?: true
    createdAt?: true
  }

  export type EventRequirementCountAggregateInputType = {
    id?: true
    eventId?: true
    label?: true
    createdAt?: true
    _all?: true
  }

  export type EventRequirementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventRequirement to aggregate.
     */
    where?: EventRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventRequirements to fetch.
     */
    orderBy?: EventRequirementOrderByWithRelationInput | EventRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventRequirements
    **/
    _count?: true | EventRequirementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventRequirementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventRequirementMaxAggregateInputType
  }

  export type GetEventRequirementAggregateType<T extends EventRequirementAggregateArgs> = {
        [P in keyof T & keyof AggregateEventRequirement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventRequirement[P]>
      : GetScalarType<T[P], AggregateEventRequirement[P]>
  }




  export type EventRequirementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventRequirementWhereInput
    orderBy?: EventRequirementOrderByWithAggregationInput | EventRequirementOrderByWithAggregationInput[]
    by: EventRequirementScalarFieldEnum[] | EventRequirementScalarFieldEnum
    having?: EventRequirementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventRequirementCountAggregateInputType | true
    _min?: EventRequirementMinAggregateInputType
    _max?: EventRequirementMaxAggregateInputType
  }

  export type EventRequirementGroupByOutputType = {
    id: string
    eventId: string
    label: string
    createdAt: Date
    _count: EventRequirementCountAggregateOutputType | null
    _min: EventRequirementMinAggregateOutputType | null
    _max: EventRequirementMaxAggregateOutputType | null
  }

  type GetEventRequirementGroupByPayload<T extends EventRequirementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventRequirementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventRequirementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventRequirementGroupByOutputType[P]>
            : GetScalarType<T[P], EventRequirementGroupByOutputType[P]>
        }
      >
    >


  export type EventRequirementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    label?: boolean
    createdAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventRequirement"]>

  export type EventRequirementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    label?: boolean
    createdAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventRequirement"]>

  export type EventRequirementSelectScalar = {
    id?: boolean
    eventId?: boolean
    label?: boolean
    createdAt?: boolean
  }

  export type EventRequirementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type EventRequirementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $EventRequirementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventRequirement"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      label: string
      createdAt: Date
    }, ExtArgs["result"]["eventRequirement"]>
    composites: {}
  }

  type EventRequirementGetPayload<S extends boolean | null | undefined | EventRequirementDefaultArgs> = $Result.GetResult<Prisma.$EventRequirementPayload, S>

  type EventRequirementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventRequirementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventRequirementCountAggregateInputType | true
    }

  export interface EventRequirementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventRequirement'], meta: { name: 'EventRequirement' } }
    /**
     * Find zero or one EventRequirement that matches the filter.
     * @param {EventRequirementFindUniqueArgs} args - Arguments to find a EventRequirement
     * @example
     * // Get one EventRequirement
     * const eventRequirement = await prisma.eventRequirement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventRequirementFindUniqueArgs>(args: SelectSubset<T, EventRequirementFindUniqueArgs<ExtArgs>>): Prisma__EventRequirementClient<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EventRequirement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventRequirementFindUniqueOrThrowArgs} args - Arguments to find a EventRequirement
     * @example
     * // Get one EventRequirement
     * const eventRequirement = await prisma.eventRequirement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventRequirementFindUniqueOrThrowArgs>(args: SelectSubset<T, EventRequirementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventRequirementClient<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EventRequirement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRequirementFindFirstArgs} args - Arguments to find a EventRequirement
     * @example
     * // Get one EventRequirement
     * const eventRequirement = await prisma.eventRequirement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventRequirementFindFirstArgs>(args?: SelectSubset<T, EventRequirementFindFirstArgs<ExtArgs>>): Prisma__EventRequirementClient<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EventRequirement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRequirementFindFirstOrThrowArgs} args - Arguments to find a EventRequirement
     * @example
     * // Get one EventRequirement
     * const eventRequirement = await prisma.eventRequirement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventRequirementFindFirstOrThrowArgs>(args?: SelectSubset<T, EventRequirementFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventRequirementClient<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EventRequirements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRequirementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventRequirements
     * const eventRequirements = await prisma.eventRequirement.findMany()
     * 
     * // Get first 10 EventRequirements
     * const eventRequirements = await prisma.eventRequirement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventRequirementWithIdOnly = await prisma.eventRequirement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventRequirementFindManyArgs>(args?: SelectSubset<T, EventRequirementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EventRequirement.
     * @param {EventRequirementCreateArgs} args - Arguments to create a EventRequirement.
     * @example
     * // Create one EventRequirement
     * const EventRequirement = await prisma.eventRequirement.create({
     *   data: {
     *     // ... data to create a EventRequirement
     *   }
     * })
     * 
     */
    create<T extends EventRequirementCreateArgs>(args: SelectSubset<T, EventRequirementCreateArgs<ExtArgs>>): Prisma__EventRequirementClient<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EventRequirements.
     * @param {EventRequirementCreateManyArgs} args - Arguments to create many EventRequirements.
     * @example
     * // Create many EventRequirements
     * const eventRequirement = await prisma.eventRequirement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventRequirementCreateManyArgs>(args?: SelectSubset<T, EventRequirementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventRequirements and returns the data saved in the database.
     * @param {EventRequirementCreateManyAndReturnArgs} args - Arguments to create many EventRequirements.
     * @example
     * // Create many EventRequirements
     * const eventRequirement = await prisma.eventRequirement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventRequirements and only return the `id`
     * const eventRequirementWithIdOnly = await prisma.eventRequirement.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventRequirementCreateManyAndReturnArgs>(args?: SelectSubset<T, EventRequirementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EventRequirement.
     * @param {EventRequirementDeleteArgs} args - Arguments to delete one EventRequirement.
     * @example
     * // Delete one EventRequirement
     * const EventRequirement = await prisma.eventRequirement.delete({
     *   where: {
     *     // ... filter to delete one EventRequirement
     *   }
     * })
     * 
     */
    delete<T extends EventRequirementDeleteArgs>(args: SelectSubset<T, EventRequirementDeleteArgs<ExtArgs>>): Prisma__EventRequirementClient<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EventRequirement.
     * @param {EventRequirementUpdateArgs} args - Arguments to update one EventRequirement.
     * @example
     * // Update one EventRequirement
     * const eventRequirement = await prisma.eventRequirement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventRequirementUpdateArgs>(args: SelectSubset<T, EventRequirementUpdateArgs<ExtArgs>>): Prisma__EventRequirementClient<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EventRequirements.
     * @param {EventRequirementDeleteManyArgs} args - Arguments to filter EventRequirements to delete.
     * @example
     * // Delete a few EventRequirements
     * const { count } = await prisma.eventRequirement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventRequirementDeleteManyArgs>(args?: SelectSubset<T, EventRequirementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventRequirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRequirementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventRequirements
     * const eventRequirement = await prisma.eventRequirement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventRequirementUpdateManyArgs>(args: SelectSubset<T, EventRequirementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EventRequirement.
     * @param {EventRequirementUpsertArgs} args - Arguments to update or create a EventRequirement.
     * @example
     * // Update or create a EventRequirement
     * const eventRequirement = await prisma.eventRequirement.upsert({
     *   create: {
     *     // ... data to create a EventRequirement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventRequirement we want to update
     *   }
     * })
     */
    upsert<T extends EventRequirementUpsertArgs>(args: SelectSubset<T, EventRequirementUpsertArgs<ExtArgs>>): Prisma__EventRequirementClient<$Result.GetResult<Prisma.$EventRequirementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EventRequirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRequirementCountArgs} args - Arguments to filter EventRequirements to count.
     * @example
     * // Count the number of EventRequirements
     * const count = await prisma.eventRequirement.count({
     *   where: {
     *     // ... the filter for the EventRequirements we want to count
     *   }
     * })
    **/
    count<T extends EventRequirementCountArgs>(
      args?: Subset<T, EventRequirementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventRequirementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventRequirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRequirementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventRequirementAggregateArgs>(args: Subset<T, EventRequirementAggregateArgs>): Prisma.PrismaPromise<GetEventRequirementAggregateType<T>>

    /**
     * Group by EventRequirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRequirementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventRequirementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventRequirementGroupByArgs['orderBy'] }
        : { orderBy?: EventRequirementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventRequirementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventRequirementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventRequirement model
   */
  readonly fields: EventRequirementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventRequirement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventRequirementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventRequirement model
   */ 
  interface EventRequirementFieldRefs {
    readonly id: FieldRef<"EventRequirement", 'String'>
    readonly eventId: FieldRef<"EventRequirement", 'String'>
    readonly label: FieldRef<"EventRequirement", 'String'>
    readonly createdAt: FieldRef<"EventRequirement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EventRequirement findUnique
   */
  export type EventRequirementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    /**
     * Filter, which EventRequirement to fetch.
     */
    where: EventRequirementWhereUniqueInput
  }

  /**
   * EventRequirement findUniqueOrThrow
   */
  export type EventRequirementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    /**
     * Filter, which EventRequirement to fetch.
     */
    where: EventRequirementWhereUniqueInput
  }

  /**
   * EventRequirement findFirst
   */
  export type EventRequirementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    /**
     * Filter, which EventRequirement to fetch.
     */
    where?: EventRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventRequirements to fetch.
     */
    orderBy?: EventRequirementOrderByWithRelationInput | EventRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventRequirements.
     */
    cursor?: EventRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventRequirements.
     */
    distinct?: EventRequirementScalarFieldEnum | EventRequirementScalarFieldEnum[]
  }

  /**
   * EventRequirement findFirstOrThrow
   */
  export type EventRequirementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    /**
     * Filter, which EventRequirement to fetch.
     */
    where?: EventRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventRequirements to fetch.
     */
    orderBy?: EventRequirementOrderByWithRelationInput | EventRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventRequirements.
     */
    cursor?: EventRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventRequirements.
     */
    distinct?: EventRequirementScalarFieldEnum | EventRequirementScalarFieldEnum[]
  }

  /**
   * EventRequirement findMany
   */
  export type EventRequirementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    /**
     * Filter, which EventRequirements to fetch.
     */
    where?: EventRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventRequirements to fetch.
     */
    orderBy?: EventRequirementOrderByWithRelationInput | EventRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventRequirements.
     */
    cursor?: EventRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventRequirements.
     */
    skip?: number
    distinct?: EventRequirementScalarFieldEnum | EventRequirementScalarFieldEnum[]
  }

  /**
   * EventRequirement create
   */
  export type EventRequirementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    /**
     * The data needed to create a EventRequirement.
     */
    data: XOR<EventRequirementCreateInput, EventRequirementUncheckedCreateInput>
  }

  /**
   * EventRequirement createMany
   */
  export type EventRequirementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventRequirements.
     */
    data: EventRequirementCreateManyInput | EventRequirementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventRequirement createManyAndReturn
   */
  export type EventRequirementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EventRequirements.
     */
    data: EventRequirementCreateManyInput | EventRequirementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventRequirement update
   */
  export type EventRequirementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    /**
     * The data needed to update a EventRequirement.
     */
    data: XOR<EventRequirementUpdateInput, EventRequirementUncheckedUpdateInput>
    /**
     * Choose, which EventRequirement to update.
     */
    where: EventRequirementWhereUniqueInput
  }

  /**
   * EventRequirement updateMany
   */
  export type EventRequirementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventRequirements.
     */
    data: XOR<EventRequirementUpdateManyMutationInput, EventRequirementUncheckedUpdateManyInput>
    /**
     * Filter which EventRequirements to update
     */
    where?: EventRequirementWhereInput
  }

  /**
   * EventRequirement upsert
   */
  export type EventRequirementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    /**
     * The filter to search for the EventRequirement to update in case it exists.
     */
    where: EventRequirementWhereUniqueInput
    /**
     * In case the EventRequirement found by the `where` argument doesn't exist, create a new EventRequirement with this data.
     */
    create: XOR<EventRequirementCreateInput, EventRequirementUncheckedCreateInput>
    /**
     * In case the EventRequirement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventRequirementUpdateInput, EventRequirementUncheckedUpdateInput>
  }

  /**
   * EventRequirement delete
   */
  export type EventRequirementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
    /**
     * Filter which EventRequirement to delete.
     */
    where: EventRequirementWhereUniqueInput
  }

  /**
   * EventRequirement deleteMany
   */
  export type EventRequirementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventRequirements to delete
     */
    where?: EventRequirementWhereInput
  }

  /**
   * EventRequirement without action
   */
  export type EventRequirementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventRequirement
     */
    select?: EventRequirementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventRequirementInclude<ExtArgs> | null
  }


  /**
   * Model EventApplication
   */

  export type AggregateEventApplication = {
    _count: EventApplicationCountAggregateOutputType | null
    _min: EventApplicationMinAggregateOutputType | null
    _max: EventApplicationMaxAggregateOutputType | null
  }

  export type EventApplicationMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    userId: string | null
    status: $Enums.ApplicationStatus | null
    note: string | null
    appliedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
  }

  export type EventApplicationMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    userId: string | null
    status: $Enums.ApplicationStatus | null
    note: string | null
    appliedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
  }

  export type EventApplicationCountAggregateOutputType = {
    id: number
    eventId: number
    userId: number
    status: number
    note: number
    appliedAt: number
    reviewedAt: number
    reviewedBy: number
    _all: number
  }


  export type EventApplicationMinAggregateInputType = {
    id?: true
    eventId?: true
    userId?: true
    status?: true
    note?: true
    appliedAt?: true
    reviewedAt?: true
    reviewedBy?: true
  }

  export type EventApplicationMaxAggregateInputType = {
    id?: true
    eventId?: true
    userId?: true
    status?: true
    note?: true
    appliedAt?: true
    reviewedAt?: true
    reviewedBy?: true
  }

  export type EventApplicationCountAggregateInputType = {
    id?: true
    eventId?: true
    userId?: true
    status?: true
    note?: true
    appliedAt?: true
    reviewedAt?: true
    reviewedBy?: true
    _all?: true
  }

  export type EventApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventApplication to aggregate.
     */
    where?: EventApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventApplications to fetch.
     */
    orderBy?: EventApplicationOrderByWithRelationInput | EventApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventApplications
    **/
    _count?: true | EventApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventApplicationMaxAggregateInputType
  }

  export type GetEventApplicationAggregateType<T extends EventApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateEventApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventApplication[P]>
      : GetScalarType<T[P], AggregateEventApplication[P]>
  }




  export type EventApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventApplicationWhereInput
    orderBy?: EventApplicationOrderByWithAggregationInput | EventApplicationOrderByWithAggregationInput[]
    by: EventApplicationScalarFieldEnum[] | EventApplicationScalarFieldEnum
    having?: EventApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventApplicationCountAggregateInputType | true
    _min?: EventApplicationMinAggregateInputType
    _max?: EventApplicationMaxAggregateInputType
  }

  export type EventApplicationGroupByOutputType = {
    id: string
    eventId: string
    userId: string
    status: $Enums.ApplicationStatus
    note: string | null
    appliedAt: Date
    reviewedAt: Date | null
    reviewedBy: string | null
    _count: EventApplicationCountAggregateOutputType | null
    _min: EventApplicationMinAggregateOutputType | null
    _max: EventApplicationMaxAggregateOutputType | null
  }

  type GetEventApplicationGroupByPayload<T extends EventApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], EventApplicationGroupByOutputType[P]>
        }
      >
    >


  export type EventApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    userId?: boolean
    status?: boolean
    note?: boolean
    appliedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    reviewer?: boolean | EventApplication$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["eventApplication"]>

  export type EventApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    userId?: boolean
    status?: boolean
    note?: boolean
    appliedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    reviewer?: boolean | EventApplication$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["eventApplication"]>

  export type EventApplicationSelectScalar = {
    id?: boolean
    eventId?: boolean
    userId?: boolean
    status?: boolean
    note?: boolean
    appliedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
  }

  export type EventApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    reviewer?: boolean | EventApplication$reviewerArgs<ExtArgs>
  }
  export type EventApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    reviewer?: boolean | EventApplication$reviewerArgs<ExtArgs>
  }

  export type $EventApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventApplication"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
      user: Prisma.$ProfilePayload<ExtArgs>
      reviewer: Prisma.$ProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      userId: string
      status: $Enums.ApplicationStatus
      note: string | null
      appliedAt: Date
      reviewedAt: Date | null
      reviewedBy: string | null
    }, ExtArgs["result"]["eventApplication"]>
    composites: {}
  }

  type EventApplicationGetPayload<S extends boolean | null | undefined | EventApplicationDefaultArgs> = $Result.GetResult<Prisma.$EventApplicationPayload, S>

  type EventApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventApplicationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventApplicationCountAggregateInputType | true
    }

  export interface EventApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventApplication'], meta: { name: 'EventApplication' } }
    /**
     * Find zero or one EventApplication that matches the filter.
     * @param {EventApplicationFindUniqueArgs} args - Arguments to find a EventApplication
     * @example
     * // Get one EventApplication
     * const eventApplication = await prisma.eventApplication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventApplicationFindUniqueArgs>(args: SelectSubset<T, EventApplicationFindUniqueArgs<ExtArgs>>): Prisma__EventApplicationClient<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EventApplication that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventApplicationFindUniqueOrThrowArgs} args - Arguments to find a EventApplication
     * @example
     * // Get one EventApplication
     * const eventApplication = await prisma.eventApplication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, EventApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventApplicationClient<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EventApplication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventApplicationFindFirstArgs} args - Arguments to find a EventApplication
     * @example
     * // Get one EventApplication
     * const eventApplication = await prisma.eventApplication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventApplicationFindFirstArgs>(args?: SelectSubset<T, EventApplicationFindFirstArgs<ExtArgs>>): Prisma__EventApplicationClient<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EventApplication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventApplicationFindFirstOrThrowArgs} args - Arguments to find a EventApplication
     * @example
     * // Get one EventApplication
     * const eventApplication = await prisma.eventApplication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, EventApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventApplicationClient<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EventApplications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventApplications
     * const eventApplications = await prisma.eventApplication.findMany()
     * 
     * // Get first 10 EventApplications
     * const eventApplications = await prisma.eventApplication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventApplicationWithIdOnly = await prisma.eventApplication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventApplicationFindManyArgs>(args?: SelectSubset<T, EventApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EventApplication.
     * @param {EventApplicationCreateArgs} args - Arguments to create a EventApplication.
     * @example
     * // Create one EventApplication
     * const EventApplication = await prisma.eventApplication.create({
     *   data: {
     *     // ... data to create a EventApplication
     *   }
     * })
     * 
     */
    create<T extends EventApplicationCreateArgs>(args: SelectSubset<T, EventApplicationCreateArgs<ExtArgs>>): Prisma__EventApplicationClient<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EventApplications.
     * @param {EventApplicationCreateManyArgs} args - Arguments to create many EventApplications.
     * @example
     * // Create many EventApplications
     * const eventApplication = await prisma.eventApplication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventApplicationCreateManyArgs>(args?: SelectSubset<T, EventApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventApplications and returns the data saved in the database.
     * @param {EventApplicationCreateManyAndReturnArgs} args - Arguments to create many EventApplications.
     * @example
     * // Create many EventApplications
     * const eventApplication = await prisma.eventApplication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventApplications and only return the `id`
     * const eventApplicationWithIdOnly = await prisma.eventApplication.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, EventApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EventApplication.
     * @param {EventApplicationDeleteArgs} args - Arguments to delete one EventApplication.
     * @example
     * // Delete one EventApplication
     * const EventApplication = await prisma.eventApplication.delete({
     *   where: {
     *     // ... filter to delete one EventApplication
     *   }
     * })
     * 
     */
    delete<T extends EventApplicationDeleteArgs>(args: SelectSubset<T, EventApplicationDeleteArgs<ExtArgs>>): Prisma__EventApplicationClient<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EventApplication.
     * @param {EventApplicationUpdateArgs} args - Arguments to update one EventApplication.
     * @example
     * // Update one EventApplication
     * const eventApplication = await prisma.eventApplication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventApplicationUpdateArgs>(args: SelectSubset<T, EventApplicationUpdateArgs<ExtArgs>>): Prisma__EventApplicationClient<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EventApplications.
     * @param {EventApplicationDeleteManyArgs} args - Arguments to filter EventApplications to delete.
     * @example
     * // Delete a few EventApplications
     * const { count } = await prisma.eventApplication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventApplicationDeleteManyArgs>(args?: SelectSubset<T, EventApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventApplications
     * const eventApplication = await prisma.eventApplication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventApplicationUpdateManyArgs>(args: SelectSubset<T, EventApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EventApplication.
     * @param {EventApplicationUpsertArgs} args - Arguments to update or create a EventApplication.
     * @example
     * // Update or create a EventApplication
     * const eventApplication = await prisma.eventApplication.upsert({
     *   create: {
     *     // ... data to create a EventApplication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventApplication we want to update
     *   }
     * })
     */
    upsert<T extends EventApplicationUpsertArgs>(args: SelectSubset<T, EventApplicationUpsertArgs<ExtArgs>>): Prisma__EventApplicationClient<$Result.GetResult<Prisma.$EventApplicationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EventApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventApplicationCountArgs} args - Arguments to filter EventApplications to count.
     * @example
     * // Count the number of EventApplications
     * const count = await prisma.eventApplication.count({
     *   where: {
     *     // ... the filter for the EventApplications we want to count
     *   }
     * })
    **/
    count<T extends EventApplicationCountArgs>(
      args?: Subset<T, EventApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventApplicationAggregateArgs>(args: Subset<T, EventApplicationAggregateArgs>): Prisma.PrismaPromise<GetEventApplicationAggregateType<T>>

    /**
     * Group by EventApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventApplicationGroupByArgs['orderBy'] }
        : { orderBy?: EventApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventApplication model
   */
  readonly fields: EventApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventApplication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    reviewer<T extends EventApplication$reviewerArgs<ExtArgs> = {}>(args?: Subset<T, EventApplication$reviewerArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventApplication model
   */ 
  interface EventApplicationFieldRefs {
    readonly id: FieldRef<"EventApplication", 'String'>
    readonly eventId: FieldRef<"EventApplication", 'String'>
    readonly userId: FieldRef<"EventApplication", 'String'>
    readonly status: FieldRef<"EventApplication", 'ApplicationStatus'>
    readonly note: FieldRef<"EventApplication", 'String'>
    readonly appliedAt: FieldRef<"EventApplication", 'DateTime'>
    readonly reviewedAt: FieldRef<"EventApplication", 'DateTime'>
    readonly reviewedBy: FieldRef<"EventApplication", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EventApplication findUnique
   */
  export type EventApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    /**
     * Filter, which EventApplication to fetch.
     */
    where: EventApplicationWhereUniqueInput
  }

  /**
   * EventApplication findUniqueOrThrow
   */
  export type EventApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    /**
     * Filter, which EventApplication to fetch.
     */
    where: EventApplicationWhereUniqueInput
  }

  /**
   * EventApplication findFirst
   */
  export type EventApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    /**
     * Filter, which EventApplication to fetch.
     */
    where?: EventApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventApplications to fetch.
     */
    orderBy?: EventApplicationOrderByWithRelationInput | EventApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventApplications.
     */
    cursor?: EventApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventApplications.
     */
    distinct?: EventApplicationScalarFieldEnum | EventApplicationScalarFieldEnum[]
  }

  /**
   * EventApplication findFirstOrThrow
   */
  export type EventApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    /**
     * Filter, which EventApplication to fetch.
     */
    where?: EventApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventApplications to fetch.
     */
    orderBy?: EventApplicationOrderByWithRelationInput | EventApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventApplications.
     */
    cursor?: EventApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventApplications.
     */
    distinct?: EventApplicationScalarFieldEnum | EventApplicationScalarFieldEnum[]
  }

  /**
   * EventApplication findMany
   */
  export type EventApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    /**
     * Filter, which EventApplications to fetch.
     */
    where?: EventApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventApplications to fetch.
     */
    orderBy?: EventApplicationOrderByWithRelationInput | EventApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventApplications.
     */
    cursor?: EventApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventApplications.
     */
    skip?: number
    distinct?: EventApplicationScalarFieldEnum | EventApplicationScalarFieldEnum[]
  }

  /**
   * EventApplication create
   */
  export type EventApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a EventApplication.
     */
    data: XOR<EventApplicationCreateInput, EventApplicationUncheckedCreateInput>
  }

  /**
   * EventApplication createMany
   */
  export type EventApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventApplications.
     */
    data: EventApplicationCreateManyInput | EventApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventApplication createManyAndReturn
   */
  export type EventApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EventApplications.
     */
    data: EventApplicationCreateManyInput | EventApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventApplication update
   */
  export type EventApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a EventApplication.
     */
    data: XOR<EventApplicationUpdateInput, EventApplicationUncheckedUpdateInput>
    /**
     * Choose, which EventApplication to update.
     */
    where: EventApplicationWhereUniqueInput
  }

  /**
   * EventApplication updateMany
   */
  export type EventApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventApplications.
     */
    data: XOR<EventApplicationUpdateManyMutationInput, EventApplicationUncheckedUpdateManyInput>
    /**
     * Filter which EventApplications to update
     */
    where?: EventApplicationWhereInput
  }

  /**
   * EventApplication upsert
   */
  export type EventApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the EventApplication to update in case it exists.
     */
    where: EventApplicationWhereUniqueInput
    /**
     * In case the EventApplication found by the `where` argument doesn't exist, create a new EventApplication with this data.
     */
    create: XOR<EventApplicationCreateInput, EventApplicationUncheckedCreateInput>
    /**
     * In case the EventApplication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventApplicationUpdateInput, EventApplicationUncheckedUpdateInput>
  }

  /**
   * EventApplication delete
   */
  export type EventApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
    /**
     * Filter which EventApplication to delete.
     */
    where: EventApplicationWhereUniqueInput
  }

  /**
   * EventApplication deleteMany
   */
  export type EventApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventApplications to delete
     */
    where?: EventApplicationWhereInput
  }

  /**
   * EventApplication.reviewer
   */
  export type EventApplication$reviewerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * EventApplication without action
   */
  export type EventApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventApplication
     */
    select?: EventApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventApplicationInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskAvgAggregateOutputType = {
    coinValue: number | null
  }

  export type TaskSumAggregateOutputType = {
    coinValue: number | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    eventId: string | null
    assignedTo: string | null
    assignedBy: string | null
    status: $Enums.TaskStatus | null
    dueDate: Date | null
    coinValue: number | null
    submissionUrl: string | null
    submissionNote: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    eventId: string | null
    assignedTo: string | null
    assignedBy: string | null
    status: $Enums.TaskStatus | null
    dueDate: Date | null
    coinValue: number | null
    submissionUrl: string | null
    submissionNote: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    title: number
    description: number
    eventId: number
    assignedTo: number
    assignedBy: number
    status: number
    dueDate: number
    coinValue: number
    submissionUrl: number
    submissionNote: number
    submittedAt: number
    reviewedAt: number
    reviewNote: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TaskAvgAggregateInputType = {
    coinValue?: true
  }

  export type TaskSumAggregateInputType = {
    coinValue?: true
  }

  export type TaskMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    eventId?: true
    assignedTo?: true
    assignedBy?: true
    status?: true
    dueDate?: true
    coinValue?: true
    submissionUrl?: true
    submissionNote?: true
    submittedAt?: true
    reviewedAt?: true
    reviewNote?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    eventId?: true
    assignedTo?: true
    assignedBy?: true
    status?: true
    dueDate?: true
    coinValue?: true
    submissionUrl?: true
    submissionNote?: true
    submittedAt?: true
    reviewedAt?: true
    reviewNote?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    eventId?: true
    assignedTo?: true
    assignedBy?: true
    status?: true
    dueDate?: true
    coinValue?: true
    submissionUrl?: true
    submissionNote?: true
    submittedAt?: true
    reviewedAt?: true
    reviewNote?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _avg?: TaskAvgAggregateInputType
    _sum?: TaskSumAggregateInputType
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    title: string
    description: string
    eventId: string | null
    assignedTo: string
    assignedBy: string
    status: $Enums.TaskStatus
    dueDate: Date | null
    coinValue: number
    submissionUrl: string | null
    submissionNote: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewNote: string | null
    createdAt: Date
    updatedAt: Date
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    eventId?: boolean
    assignedTo?: boolean
    assignedBy?: boolean
    status?: boolean
    dueDate?: boolean
    coinValue?: boolean
    submissionUrl?: boolean
    submissionNote?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | Task$eventArgs<ExtArgs>
    assignee?: boolean | ProfileDefaultArgs<ExtArgs>
    assigner?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    eventId?: boolean
    assignedTo?: boolean
    assignedBy?: boolean
    status?: boolean
    dueDate?: boolean
    coinValue?: boolean
    submissionUrl?: boolean
    submissionNote?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | Task$eventArgs<ExtArgs>
    assignee?: boolean | ProfileDefaultArgs<ExtArgs>
    assigner?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    eventId?: boolean
    assignedTo?: boolean
    assignedBy?: boolean
    status?: boolean
    dueDate?: boolean
    coinValue?: boolean
    submissionUrl?: boolean
    submissionNote?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | Task$eventArgs<ExtArgs>
    assignee?: boolean | ProfileDefaultArgs<ExtArgs>
    assigner?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | Task$eventArgs<ExtArgs>
    assignee?: boolean | ProfileDefaultArgs<ExtArgs>
    assigner?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      event: Prisma.$EventPayload<ExtArgs> | null
      assignee: Prisma.$ProfilePayload<ExtArgs>
      assigner: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      eventId: string | null
      assignedTo: string
      assignedBy: string
      status: $Enums.TaskStatus
      dueDate: Date | null
      coinValue: number
      submissionUrl: string | null
      submissionNote: string | null
      submittedAt: Date | null
      reviewedAt: Date | null
      reviewNote: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends Task$eventArgs<ExtArgs> = {}>(args?: Subset<T, Task$eventArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    assignee<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    assigner<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */ 
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly eventId: FieldRef<"Task", 'String'>
    readonly assignedTo: FieldRef<"Task", 'String'>
    readonly assignedBy: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'TaskStatus'>
    readonly dueDate: FieldRef<"Task", 'DateTime'>
    readonly coinValue: FieldRef<"Task", 'Int'>
    readonly submissionUrl: FieldRef<"Task", 'String'>
    readonly submissionNote: FieldRef<"Task", 'String'>
    readonly submittedAt: FieldRef<"Task", 'DateTime'>
    readonly reviewedAt: FieldRef<"Task", 'DateTime'>
    readonly reviewNote: FieldRef<"Task", 'String'>
    readonly createdAt: FieldRef<"Task", 'DateTime'>
    readonly updatedAt: FieldRef<"Task", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
  }

  /**
   * Task.event
   */
  export type Task$eventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model WalletBalance
   */

  export type AggregateWalletBalance = {
    _count: WalletBalanceCountAggregateOutputType | null
    _avg: WalletBalanceAvgAggregateOutputType | null
    _sum: WalletBalanceSumAggregateOutputType | null
    _min: WalletBalanceMinAggregateOutputType | null
    _max: WalletBalanceMaxAggregateOutputType | null
  }

  export type WalletBalanceAvgAggregateOutputType = {
    totalEarned: number | null
    totalRedeemed: number | null
    currentBalance: number | null
  }

  export type WalletBalanceSumAggregateOutputType = {
    totalEarned: number | null
    totalRedeemed: number | null
    currentBalance: number | null
  }

  export type WalletBalanceMinAggregateOutputType = {
    userId: string | null
    totalEarned: number | null
    totalRedeemed: number | null
    currentBalance: number | null
  }

  export type WalletBalanceMaxAggregateOutputType = {
    userId: string | null
    totalEarned: number | null
    totalRedeemed: number | null
    currentBalance: number | null
  }

  export type WalletBalanceCountAggregateOutputType = {
    userId: number
    totalEarned: number
    totalRedeemed: number
    currentBalance: number
    _all: number
  }


  export type WalletBalanceAvgAggregateInputType = {
    totalEarned?: true
    totalRedeemed?: true
    currentBalance?: true
  }

  export type WalletBalanceSumAggregateInputType = {
    totalEarned?: true
    totalRedeemed?: true
    currentBalance?: true
  }

  export type WalletBalanceMinAggregateInputType = {
    userId?: true
    totalEarned?: true
    totalRedeemed?: true
    currentBalance?: true
  }

  export type WalletBalanceMaxAggregateInputType = {
    userId?: true
    totalEarned?: true
    totalRedeemed?: true
    currentBalance?: true
  }

  export type WalletBalanceCountAggregateInputType = {
    userId?: true
    totalEarned?: true
    totalRedeemed?: true
    currentBalance?: true
    _all?: true
  }

  export type WalletBalanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WalletBalance to aggregate.
     */
    where?: WalletBalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletBalances to fetch.
     */
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WalletBalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletBalances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletBalances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WalletBalances
    **/
    _count?: true | WalletBalanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WalletBalanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WalletBalanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WalletBalanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WalletBalanceMaxAggregateInputType
  }

  export type GetWalletBalanceAggregateType<T extends WalletBalanceAggregateArgs> = {
        [P in keyof T & keyof AggregateWalletBalance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWalletBalance[P]>
      : GetScalarType<T[P], AggregateWalletBalance[P]>
  }




  export type WalletBalanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletBalanceWhereInput
    orderBy?: WalletBalanceOrderByWithAggregationInput | WalletBalanceOrderByWithAggregationInput[]
    by: WalletBalanceScalarFieldEnum[] | WalletBalanceScalarFieldEnum
    having?: WalletBalanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WalletBalanceCountAggregateInputType | true
    _avg?: WalletBalanceAvgAggregateInputType
    _sum?: WalletBalanceSumAggregateInputType
    _min?: WalletBalanceMinAggregateInputType
    _max?: WalletBalanceMaxAggregateInputType
  }

  export type WalletBalanceGroupByOutputType = {
    userId: string
    totalEarned: number
    totalRedeemed: number
    currentBalance: number
    _count: WalletBalanceCountAggregateOutputType | null
    _avg: WalletBalanceAvgAggregateOutputType | null
    _sum: WalletBalanceSumAggregateOutputType | null
    _min: WalletBalanceMinAggregateOutputType | null
    _max: WalletBalanceMaxAggregateOutputType | null
  }

  type GetWalletBalanceGroupByPayload<T extends WalletBalanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WalletBalanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WalletBalanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WalletBalanceGroupByOutputType[P]>
            : GetScalarType<T[P], WalletBalanceGroupByOutputType[P]>
        }
      >
    >


  export type WalletBalanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    totalEarned?: boolean
    totalRedeemed?: boolean
    currentBalance?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["walletBalance"]>

  export type WalletBalanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    totalEarned?: boolean
    totalRedeemed?: boolean
    currentBalance?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["walletBalance"]>

  export type WalletBalanceSelectScalar = {
    userId?: boolean
    totalEarned?: boolean
    totalRedeemed?: boolean
    currentBalance?: boolean
  }

  export type WalletBalanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type WalletBalanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $WalletBalancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WalletBalance"
    objects: {
      user: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      totalEarned: number
      totalRedeemed: number
      currentBalance: number
    }, ExtArgs["result"]["walletBalance"]>
    composites: {}
  }

  type WalletBalanceGetPayload<S extends boolean | null | undefined | WalletBalanceDefaultArgs> = $Result.GetResult<Prisma.$WalletBalancePayload, S>

  type WalletBalanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WalletBalanceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WalletBalanceCountAggregateInputType | true
    }

  export interface WalletBalanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WalletBalance'], meta: { name: 'WalletBalance' } }
    /**
     * Find zero or one WalletBalance that matches the filter.
     * @param {WalletBalanceFindUniqueArgs} args - Arguments to find a WalletBalance
     * @example
     * // Get one WalletBalance
     * const walletBalance = await prisma.walletBalance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WalletBalanceFindUniqueArgs>(args: SelectSubset<T, WalletBalanceFindUniqueArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WalletBalance that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WalletBalanceFindUniqueOrThrowArgs} args - Arguments to find a WalletBalance
     * @example
     * // Get one WalletBalance
     * const walletBalance = await prisma.walletBalance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WalletBalanceFindUniqueOrThrowArgs>(args: SelectSubset<T, WalletBalanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WalletBalance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceFindFirstArgs} args - Arguments to find a WalletBalance
     * @example
     * // Get one WalletBalance
     * const walletBalance = await prisma.walletBalance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WalletBalanceFindFirstArgs>(args?: SelectSubset<T, WalletBalanceFindFirstArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WalletBalance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceFindFirstOrThrowArgs} args - Arguments to find a WalletBalance
     * @example
     * // Get one WalletBalance
     * const walletBalance = await prisma.walletBalance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WalletBalanceFindFirstOrThrowArgs>(args?: SelectSubset<T, WalletBalanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WalletBalances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WalletBalances
     * const walletBalances = await prisma.walletBalance.findMany()
     * 
     * // Get first 10 WalletBalances
     * const walletBalances = await prisma.walletBalance.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const walletBalanceWithUserIdOnly = await prisma.walletBalance.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends WalletBalanceFindManyArgs>(args?: SelectSubset<T, WalletBalanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WalletBalance.
     * @param {WalletBalanceCreateArgs} args - Arguments to create a WalletBalance.
     * @example
     * // Create one WalletBalance
     * const WalletBalance = await prisma.walletBalance.create({
     *   data: {
     *     // ... data to create a WalletBalance
     *   }
     * })
     * 
     */
    create<T extends WalletBalanceCreateArgs>(args: SelectSubset<T, WalletBalanceCreateArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WalletBalances.
     * @param {WalletBalanceCreateManyArgs} args - Arguments to create many WalletBalances.
     * @example
     * // Create many WalletBalances
     * const walletBalance = await prisma.walletBalance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WalletBalanceCreateManyArgs>(args?: SelectSubset<T, WalletBalanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WalletBalances and returns the data saved in the database.
     * @param {WalletBalanceCreateManyAndReturnArgs} args - Arguments to create many WalletBalances.
     * @example
     * // Create many WalletBalances
     * const walletBalance = await prisma.walletBalance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WalletBalances and only return the `userId`
     * const walletBalanceWithUserIdOnly = await prisma.walletBalance.createManyAndReturn({ 
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WalletBalanceCreateManyAndReturnArgs>(args?: SelectSubset<T, WalletBalanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WalletBalance.
     * @param {WalletBalanceDeleteArgs} args - Arguments to delete one WalletBalance.
     * @example
     * // Delete one WalletBalance
     * const WalletBalance = await prisma.walletBalance.delete({
     *   where: {
     *     // ... filter to delete one WalletBalance
     *   }
     * })
     * 
     */
    delete<T extends WalletBalanceDeleteArgs>(args: SelectSubset<T, WalletBalanceDeleteArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WalletBalance.
     * @param {WalletBalanceUpdateArgs} args - Arguments to update one WalletBalance.
     * @example
     * // Update one WalletBalance
     * const walletBalance = await prisma.walletBalance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WalletBalanceUpdateArgs>(args: SelectSubset<T, WalletBalanceUpdateArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WalletBalances.
     * @param {WalletBalanceDeleteManyArgs} args - Arguments to filter WalletBalances to delete.
     * @example
     * // Delete a few WalletBalances
     * const { count } = await prisma.walletBalance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WalletBalanceDeleteManyArgs>(args?: SelectSubset<T, WalletBalanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WalletBalances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WalletBalances
     * const walletBalance = await prisma.walletBalance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WalletBalanceUpdateManyArgs>(args: SelectSubset<T, WalletBalanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WalletBalance.
     * @param {WalletBalanceUpsertArgs} args - Arguments to update or create a WalletBalance.
     * @example
     * // Update or create a WalletBalance
     * const walletBalance = await prisma.walletBalance.upsert({
     *   create: {
     *     // ... data to create a WalletBalance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WalletBalance we want to update
     *   }
     * })
     */
    upsert<T extends WalletBalanceUpsertArgs>(args: SelectSubset<T, WalletBalanceUpsertArgs<ExtArgs>>): Prisma__WalletBalanceClient<$Result.GetResult<Prisma.$WalletBalancePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WalletBalances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceCountArgs} args - Arguments to filter WalletBalances to count.
     * @example
     * // Count the number of WalletBalances
     * const count = await prisma.walletBalance.count({
     *   where: {
     *     // ... the filter for the WalletBalances we want to count
     *   }
     * })
    **/
    count<T extends WalletBalanceCountArgs>(
      args?: Subset<T, WalletBalanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WalletBalanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WalletBalance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WalletBalanceAggregateArgs>(args: Subset<T, WalletBalanceAggregateArgs>): Prisma.PrismaPromise<GetWalletBalanceAggregateType<T>>

    /**
     * Group by WalletBalance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletBalanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WalletBalanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WalletBalanceGroupByArgs['orderBy'] }
        : { orderBy?: WalletBalanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WalletBalanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWalletBalanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WalletBalance model
   */
  readonly fields: WalletBalanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WalletBalance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WalletBalanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WalletBalance model
   */ 
  interface WalletBalanceFieldRefs {
    readonly userId: FieldRef<"WalletBalance", 'String'>
    readonly totalEarned: FieldRef<"WalletBalance", 'Int'>
    readonly totalRedeemed: FieldRef<"WalletBalance", 'Int'>
    readonly currentBalance: FieldRef<"WalletBalance", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * WalletBalance findUnique
   */
  export type WalletBalanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalance to fetch.
     */
    where: WalletBalanceWhereUniqueInput
  }

  /**
   * WalletBalance findUniqueOrThrow
   */
  export type WalletBalanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalance to fetch.
     */
    where: WalletBalanceWhereUniqueInput
  }

  /**
   * WalletBalance findFirst
   */
  export type WalletBalanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalance to fetch.
     */
    where?: WalletBalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletBalances to fetch.
     */
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WalletBalances.
     */
    cursor?: WalletBalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletBalances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletBalances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WalletBalances.
     */
    distinct?: WalletBalanceScalarFieldEnum | WalletBalanceScalarFieldEnum[]
  }

  /**
   * WalletBalance findFirstOrThrow
   */
  export type WalletBalanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalance to fetch.
     */
    where?: WalletBalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletBalances to fetch.
     */
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WalletBalances.
     */
    cursor?: WalletBalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletBalances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletBalances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WalletBalances.
     */
    distinct?: WalletBalanceScalarFieldEnum | WalletBalanceScalarFieldEnum[]
  }

  /**
   * WalletBalance findMany
   */
  export type WalletBalanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter, which WalletBalances to fetch.
     */
    where?: WalletBalanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletBalances to fetch.
     */
    orderBy?: WalletBalanceOrderByWithRelationInput | WalletBalanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WalletBalances.
     */
    cursor?: WalletBalanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletBalances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletBalances.
     */
    skip?: number
    distinct?: WalletBalanceScalarFieldEnum | WalletBalanceScalarFieldEnum[]
  }

  /**
   * WalletBalance create
   */
  export type WalletBalanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * The data needed to create a WalletBalance.
     */
    data: XOR<WalletBalanceCreateInput, WalletBalanceUncheckedCreateInput>
  }

  /**
   * WalletBalance createMany
   */
  export type WalletBalanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WalletBalances.
     */
    data: WalletBalanceCreateManyInput | WalletBalanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WalletBalance createManyAndReturn
   */
  export type WalletBalanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WalletBalances.
     */
    data: WalletBalanceCreateManyInput | WalletBalanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WalletBalance update
   */
  export type WalletBalanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * The data needed to update a WalletBalance.
     */
    data: XOR<WalletBalanceUpdateInput, WalletBalanceUncheckedUpdateInput>
    /**
     * Choose, which WalletBalance to update.
     */
    where: WalletBalanceWhereUniqueInput
  }

  /**
   * WalletBalance updateMany
   */
  export type WalletBalanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WalletBalances.
     */
    data: XOR<WalletBalanceUpdateManyMutationInput, WalletBalanceUncheckedUpdateManyInput>
    /**
     * Filter which WalletBalances to update
     */
    where?: WalletBalanceWhereInput
  }

  /**
   * WalletBalance upsert
   */
  export type WalletBalanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * The filter to search for the WalletBalance to update in case it exists.
     */
    where: WalletBalanceWhereUniqueInput
    /**
     * In case the WalletBalance found by the `where` argument doesn't exist, create a new WalletBalance with this data.
     */
    create: XOR<WalletBalanceCreateInput, WalletBalanceUncheckedCreateInput>
    /**
     * In case the WalletBalance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WalletBalanceUpdateInput, WalletBalanceUncheckedUpdateInput>
  }

  /**
   * WalletBalance delete
   */
  export type WalletBalanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
    /**
     * Filter which WalletBalance to delete.
     */
    where: WalletBalanceWhereUniqueInput
  }

  /**
   * WalletBalance deleteMany
   */
  export type WalletBalanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WalletBalances to delete
     */
    where?: WalletBalanceWhereInput
  }

  /**
   * WalletBalance without action
   */
  export type WalletBalanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletBalance
     */
    select?: WalletBalanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletBalanceInclude<ExtArgs> | null
  }


  /**
   * Model CoinTransaction
   */

  export type AggregateCoinTransaction = {
    _count: CoinTransactionCountAggregateOutputType | null
    _avg: CoinTransactionAvgAggregateOutputType | null
    _sum: CoinTransactionSumAggregateOutputType | null
    _min: CoinTransactionMinAggregateOutputType | null
    _max: CoinTransactionMaxAggregateOutputType | null
  }

  export type CoinTransactionAvgAggregateOutputType = {
    amount: number | null
  }

  export type CoinTransactionSumAggregateOutputType = {
    amount: number | null
  }

  export type CoinTransactionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.TransactionType | null
    amount: number | null
    description: string | null
    referenceId: string | null
    referenceType: string | null
    createdAt: Date | null
  }

  export type CoinTransactionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.TransactionType | null
    amount: number | null
    description: string | null
    referenceId: string | null
    referenceType: string | null
    createdAt: Date | null
  }

  export type CoinTransactionCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    amount: number
    description: number
    referenceId: number
    referenceType: number
    createdAt: number
    _all: number
  }


  export type CoinTransactionAvgAggregateInputType = {
    amount?: true
  }

  export type CoinTransactionSumAggregateInputType = {
    amount?: true
  }

  export type CoinTransactionMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    amount?: true
    description?: true
    referenceId?: true
    referenceType?: true
    createdAt?: true
  }

  export type CoinTransactionMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    amount?: true
    description?: true
    referenceId?: true
    referenceType?: true
    createdAt?: true
  }

  export type CoinTransactionCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    amount?: true
    description?: true
    referenceId?: true
    referenceType?: true
    createdAt?: true
    _all?: true
  }

  export type CoinTransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CoinTransaction to aggregate.
     */
    where?: CoinTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CoinTransactions to fetch.
     */
    orderBy?: CoinTransactionOrderByWithRelationInput | CoinTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CoinTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CoinTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CoinTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CoinTransactions
    **/
    _count?: true | CoinTransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CoinTransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CoinTransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CoinTransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CoinTransactionMaxAggregateInputType
  }

  export type GetCoinTransactionAggregateType<T extends CoinTransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateCoinTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCoinTransaction[P]>
      : GetScalarType<T[P], AggregateCoinTransaction[P]>
  }




  export type CoinTransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CoinTransactionWhereInput
    orderBy?: CoinTransactionOrderByWithAggregationInput | CoinTransactionOrderByWithAggregationInput[]
    by: CoinTransactionScalarFieldEnum[] | CoinTransactionScalarFieldEnum
    having?: CoinTransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CoinTransactionCountAggregateInputType | true
    _avg?: CoinTransactionAvgAggregateInputType
    _sum?: CoinTransactionSumAggregateInputType
    _min?: CoinTransactionMinAggregateInputType
    _max?: CoinTransactionMaxAggregateInputType
  }

  export type CoinTransactionGroupByOutputType = {
    id: string
    userId: string
    type: $Enums.TransactionType
    amount: number
    description: string
    referenceId: string | null
    referenceType: string | null
    createdAt: Date
    _count: CoinTransactionCountAggregateOutputType | null
    _avg: CoinTransactionAvgAggregateOutputType | null
    _sum: CoinTransactionSumAggregateOutputType | null
    _min: CoinTransactionMinAggregateOutputType | null
    _max: CoinTransactionMaxAggregateOutputType | null
  }

  type GetCoinTransactionGroupByPayload<T extends CoinTransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CoinTransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CoinTransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CoinTransactionGroupByOutputType[P]>
            : GetScalarType<T[P], CoinTransactionGroupByOutputType[P]>
        }
      >
    >


  export type CoinTransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    amount?: boolean
    description?: boolean
    referenceId?: boolean
    referenceType?: boolean
    createdAt?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["coinTransaction"]>

  export type CoinTransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    amount?: boolean
    description?: boolean
    referenceId?: boolean
    referenceType?: boolean
    createdAt?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["coinTransaction"]>

  export type CoinTransactionSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    amount?: boolean
    description?: boolean
    referenceId?: boolean
    referenceType?: boolean
    createdAt?: boolean
  }

  export type CoinTransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type CoinTransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $CoinTransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CoinTransaction"
    objects: {
      user: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: $Enums.TransactionType
      amount: number
      description: string
      referenceId: string | null
      referenceType: string | null
      createdAt: Date
    }, ExtArgs["result"]["coinTransaction"]>
    composites: {}
  }

  type CoinTransactionGetPayload<S extends boolean | null | undefined | CoinTransactionDefaultArgs> = $Result.GetResult<Prisma.$CoinTransactionPayload, S>

  type CoinTransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CoinTransactionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CoinTransactionCountAggregateInputType | true
    }

  export interface CoinTransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CoinTransaction'], meta: { name: 'CoinTransaction' } }
    /**
     * Find zero or one CoinTransaction that matches the filter.
     * @param {CoinTransactionFindUniqueArgs} args - Arguments to find a CoinTransaction
     * @example
     * // Get one CoinTransaction
     * const coinTransaction = await prisma.coinTransaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CoinTransactionFindUniqueArgs>(args: SelectSubset<T, CoinTransactionFindUniqueArgs<ExtArgs>>): Prisma__CoinTransactionClient<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CoinTransaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CoinTransactionFindUniqueOrThrowArgs} args - Arguments to find a CoinTransaction
     * @example
     * // Get one CoinTransaction
     * const coinTransaction = await prisma.coinTransaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CoinTransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, CoinTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CoinTransactionClient<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CoinTransaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinTransactionFindFirstArgs} args - Arguments to find a CoinTransaction
     * @example
     * // Get one CoinTransaction
     * const coinTransaction = await prisma.coinTransaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CoinTransactionFindFirstArgs>(args?: SelectSubset<T, CoinTransactionFindFirstArgs<ExtArgs>>): Prisma__CoinTransactionClient<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CoinTransaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinTransactionFindFirstOrThrowArgs} args - Arguments to find a CoinTransaction
     * @example
     * // Get one CoinTransaction
     * const coinTransaction = await prisma.coinTransaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CoinTransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, CoinTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CoinTransactionClient<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CoinTransactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinTransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CoinTransactions
     * const coinTransactions = await prisma.coinTransaction.findMany()
     * 
     * // Get first 10 CoinTransactions
     * const coinTransactions = await prisma.coinTransaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const coinTransactionWithIdOnly = await prisma.coinTransaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CoinTransactionFindManyArgs>(args?: SelectSubset<T, CoinTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CoinTransaction.
     * @param {CoinTransactionCreateArgs} args - Arguments to create a CoinTransaction.
     * @example
     * // Create one CoinTransaction
     * const CoinTransaction = await prisma.coinTransaction.create({
     *   data: {
     *     // ... data to create a CoinTransaction
     *   }
     * })
     * 
     */
    create<T extends CoinTransactionCreateArgs>(args: SelectSubset<T, CoinTransactionCreateArgs<ExtArgs>>): Prisma__CoinTransactionClient<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CoinTransactions.
     * @param {CoinTransactionCreateManyArgs} args - Arguments to create many CoinTransactions.
     * @example
     * // Create many CoinTransactions
     * const coinTransaction = await prisma.coinTransaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CoinTransactionCreateManyArgs>(args?: SelectSubset<T, CoinTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CoinTransactions and returns the data saved in the database.
     * @param {CoinTransactionCreateManyAndReturnArgs} args - Arguments to create many CoinTransactions.
     * @example
     * // Create many CoinTransactions
     * const coinTransaction = await prisma.coinTransaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CoinTransactions and only return the `id`
     * const coinTransactionWithIdOnly = await prisma.coinTransaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CoinTransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, CoinTransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CoinTransaction.
     * @param {CoinTransactionDeleteArgs} args - Arguments to delete one CoinTransaction.
     * @example
     * // Delete one CoinTransaction
     * const CoinTransaction = await prisma.coinTransaction.delete({
     *   where: {
     *     // ... filter to delete one CoinTransaction
     *   }
     * })
     * 
     */
    delete<T extends CoinTransactionDeleteArgs>(args: SelectSubset<T, CoinTransactionDeleteArgs<ExtArgs>>): Prisma__CoinTransactionClient<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CoinTransaction.
     * @param {CoinTransactionUpdateArgs} args - Arguments to update one CoinTransaction.
     * @example
     * // Update one CoinTransaction
     * const coinTransaction = await prisma.coinTransaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CoinTransactionUpdateArgs>(args: SelectSubset<T, CoinTransactionUpdateArgs<ExtArgs>>): Prisma__CoinTransactionClient<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CoinTransactions.
     * @param {CoinTransactionDeleteManyArgs} args - Arguments to filter CoinTransactions to delete.
     * @example
     * // Delete a few CoinTransactions
     * const { count } = await prisma.coinTransaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CoinTransactionDeleteManyArgs>(args?: SelectSubset<T, CoinTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CoinTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinTransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CoinTransactions
     * const coinTransaction = await prisma.coinTransaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CoinTransactionUpdateManyArgs>(args: SelectSubset<T, CoinTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CoinTransaction.
     * @param {CoinTransactionUpsertArgs} args - Arguments to update or create a CoinTransaction.
     * @example
     * // Update or create a CoinTransaction
     * const coinTransaction = await prisma.coinTransaction.upsert({
     *   create: {
     *     // ... data to create a CoinTransaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CoinTransaction we want to update
     *   }
     * })
     */
    upsert<T extends CoinTransactionUpsertArgs>(args: SelectSubset<T, CoinTransactionUpsertArgs<ExtArgs>>): Prisma__CoinTransactionClient<$Result.GetResult<Prisma.$CoinTransactionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CoinTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinTransactionCountArgs} args - Arguments to filter CoinTransactions to count.
     * @example
     * // Count the number of CoinTransactions
     * const count = await prisma.coinTransaction.count({
     *   where: {
     *     // ... the filter for the CoinTransactions we want to count
     *   }
     * })
    **/
    count<T extends CoinTransactionCountArgs>(
      args?: Subset<T, CoinTransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CoinTransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CoinTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinTransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CoinTransactionAggregateArgs>(args: Subset<T, CoinTransactionAggregateArgs>): Prisma.PrismaPromise<GetCoinTransactionAggregateType<T>>

    /**
     * Group by CoinTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinTransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CoinTransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CoinTransactionGroupByArgs['orderBy'] }
        : { orderBy?: CoinTransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CoinTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCoinTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CoinTransaction model
   */
  readonly fields: CoinTransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CoinTransaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CoinTransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CoinTransaction model
   */ 
  interface CoinTransactionFieldRefs {
    readonly id: FieldRef<"CoinTransaction", 'String'>
    readonly userId: FieldRef<"CoinTransaction", 'String'>
    readonly type: FieldRef<"CoinTransaction", 'TransactionType'>
    readonly amount: FieldRef<"CoinTransaction", 'Int'>
    readonly description: FieldRef<"CoinTransaction", 'String'>
    readonly referenceId: FieldRef<"CoinTransaction", 'String'>
    readonly referenceType: FieldRef<"CoinTransaction", 'String'>
    readonly createdAt: FieldRef<"CoinTransaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CoinTransaction findUnique
   */
  export type CoinTransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CoinTransaction to fetch.
     */
    where: CoinTransactionWhereUniqueInput
  }

  /**
   * CoinTransaction findUniqueOrThrow
   */
  export type CoinTransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CoinTransaction to fetch.
     */
    where: CoinTransactionWhereUniqueInput
  }

  /**
   * CoinTransaction findFirst
   */
  export type CoinTransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CoinTransaction to fetch.
     */
    where?: CoinTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CoinTransactions to fetch.
     */
    orderBy?: CoinTransactionOrderByWithRelationInput | CoinTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CoinTransactions.
     */
    cursor?: CoinTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CoinTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CoinTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CoinTransactions.
     */
    distinct?: CoinTransactionScalarFieldEnum | CoinTransactionScalarFieldEnum[]
  }

  /**
   * CoinTransaction findFirstOrThrow
   */
  export type CoinTransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CoinTransaction to fetch.
     */
    where?: CoinTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CoinTransactions to fetch.
     */
    orderBy?: CoinTransactionOrderByWithRelationInput | CoinTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CoinTransactions.
     */
    cursor?: CoinTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CoinTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CoinTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CoinTransactions.
     */
    distinct?: CoinTransactionScalarFieldEnum | CoinTransactionScalarFieldEnum[]
  }

  /**
   * CoinTransaction findMany
   */
  export type CoinTransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    /**
     * Filter, which CoinTransactions to fetch.
     */
    where?: CoinTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CoinTransactions to fetch.
     */
    orderBy?: CoinTransactionOrderByWithRelationInput | CoinTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CoinTransactions.
     */
    cursor?: CoinTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CoinTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CoinTransactions.
     */
    skip?: number
    distinct?: CoinTransactionScalarFieldEnum | CoinTransactionScalarFieldEnum[]
  }

  /**
   * CoinTransaction create
   */
  export type CoinTransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a CoinTransaction.
     */
    data: XOR<CoinTransactionCreateInput, CoinTransactionUncheckedCreateInput>
  }

  /**
   * CoinTransaction createMany
   */
  export type CoinTransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CoinTransactions.
     */
    data: CoinTransactionCreateManyInput | CoinTransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CoinTransaction createManyAndReturn
   */
  export type CoinTransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CoinTransactions.
     */
    data: CoinTransactionCreateManyInput | CoinTransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CoinTransaction update
   */
  export type CoinTransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a CoinTransaction.
     */
    data: XOR<CoinTransactionUpdateInput, CoinTransactionUncheckedUpdateInput>
    /**
     * Choose, which CoinTransaction to update.
     */
    where: CoinTransactionWhereUniqueInput
  }

  /**
   * CoinTransaction updateMany
   */
  export type CoinTransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CoinTransactions.
     */
    data: XOR<CoinTransactionUpdateManyMutationInput, CoinTransactionUncheckedUpdateManyInput>
    /**
     * Filter which CoinTransactions to update
     */
    where?: CoinTransactionWhereInput
  }

  /**
   * CoinTransaction upsert
   */
  export type CoinTransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the CoinTransaction to update in case it exists.
     */
    where: CoinTransactionWhereUniqueInput
    /**
     * In case the CoinTransaction found by the `where` argument doesn't exist, create a new CoinTransaction with this data.
     */
    create: XOR<CoinTransactionCreateInput, CoinTransactionUncheckedCreateInput>
    /**
     * In case the CoinTransaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CoinTransactionUpdateInput, CoinTransactionUncheckedUpdateInput>
  }

  /**
   * CoinTransaction delete
   */
  export type CoinTransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
    /**
     * Filter which CoinTransaction to delete.
     */
    where: CoinTransactionWhereUniqueInput
  }

  /**
   * CoinTransaction deleteMany
   */
  export type CoinTransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CoinTransactions to delete
     */
    where?: CoinTransactionWhereInput
  }

  /**
   * CoinTransaction without action
   */
  export type CoinTransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinTransaction
     */
    select?: CoinTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinTransactionInclude<ExtArgs> | null
  }


  /**
   * Model Ambassador
   */

  export type AggregateAmbassador = {
    _count: AmbassadorCountAggregateOutputType | null
    _avg: AmbassadorAvgAggregateOutputType | null
    _sum: AmbassadorSumAggregateOutputType | null
    _min: AmbassadorMinAggregateOutputType | null
    _max: AmbassadorMaxAggregateOutputType | null
  }

  export type AmbassadorAvgAggregateOutputType = {
    referralCount: number | null
    totalCoinsEarned: number | null
  }

  export type AmbassadorSumAggregateOutputType = {
    referralCount: number | null
    totalCoinsEarned: number | null
  }

  export type AmbassadorMinAggregateOutputType = {
    id: string | null
    userId: string | null
    referralCode: string | null
    referralCount: number | null
    totalCoinsEarned: number | null
    tier: $Enums.AmbassadorTier | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type AmbassadorMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    referralCode: string | null
    referralCount: number | null
    totalCoinsEarned: number | null
    tier: $Enums.AmbassadorTier | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type AmbassadorCountAggregateOutputType = {
    id: number
    userId: number
    referralCode: number
    referralCount: number
    totalCoinsEarned: number
    tier: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type AmbassadorAvgAggregateInputType = {
    referralCount?: true
    totalCoinsEarned?: true
  }

  export type AmbassadorSumAggregateInputType = {
    referralCount?: true
    totalCoinsEarned?: true
  }

  export type AmbassadorMinAggregateInputType = {
    id?: true
    userId?: true
    referralCode?: true
    referralCount?: true
    totalCoinsEarned?: true
    tier?: true
    isActive?: true
    createdAt?: true
  }

  export type AmbassadorMaxAggregateInputType = {
    id?: true
    userId?: true
    referralCode?: true
    referralCount?: true
    totalCoinsEarned?: true
    tier?: true
    isActive?: true
    createdAt?: true
  }

  export type AmbassadorCountAggregateInputType = {
    id?: true
    userId?: true
    referralCode?: true
    referralCount?: true
    totalCoinsEarned?: true
    tier?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type AmbassadorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ambassador to aggregate.
     */
    where?: AmbassadorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ambassadors to fetch.
     */
    orderBy?: AmbassadorOrderByWithRelationInput | AmbassadorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AmbassadorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ambassadors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ambassadors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ambassadors
    **/
    _count?: true | AmbassadorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AmbassadorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AmbassadorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AmbassadorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AmbassadorMaxAggregateInputType
  }

  export type GetAmbassadorAggregateType<T extends AmbassadorAggregateArgs> = {
        [P in keyof T & keyof AggregateAmbassador]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAmbassador[P]>
      : GetScalarType<T[P], AggregateAmbassador[P]>
  }




  export type AmbassadorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmbassadorWhereInput
    orderBy?: AmbassadorOrderByWithAggregationInput | AmbassadorOrderByWithAggregationInput[]
    by: AmbassadorScalarFieldEnum[] | AmbassadorScalarFieldEnum
    having?: AmbassadorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AmbassadorCountAggregateInputType | true
    _avg?: AmbassadorAvgAggregateInputType
    _sum?: AmbassadorSumAggregateInputType
    _min?: AmbassadorMinAggregateInputType
    _max?: AmbassadorMaxAggregateInputType
  }

  export type AmbassadorGroupByOutputType = {
    id: string
    userId: string
    referralCode: string
    referralCount: number
    totalCoinsEarned: number
    tier: $Enums.AmbassadorTier
    isActive: boolean
    createdAt: Date
    _count: AmbassadorCountAggregateOutputType | null
    _avg: AmbassadorAvgAggregateOutputType | null
    _sum: AmbassadorSumAggregateOutputType | null
    _min: AmbassadorMinAggregateOutputType | null
    _max: AmbassadorMaxAggregateOutputType | null
  }

  type GetAmbassadorGroupByPayload<T extends AmbassadorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AmbassadorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AmbassadorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AmbassadorGroupByOutputType[P]>
            : GetScalarType<T[P], AmbassadorGroupByOutputType[P]>
        }
      >
    >


  export type AmbassadorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    referralCode?: boolean
    referralCount?: boolean
    totalCoinsEarned?: boolean
    tier?: boolean
    isActive?: boolean
    createdAt?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    students?: boolean | Ambassador$studentsArgs<ExtArgs>
    _count?: boolean | AmbassadorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ambassador"]>

  export type AmbassadorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    referralCode?: boolean
    referralCount?: boolean
    totalCoinsEarned?: boolean
    tier?: boolean
    isActive?: boolean
    createdAt?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ambassador"]>

  export type AmbassadorSelectScalar = {
    id?: boolean
    userId?: boolean
    referralCode?: boolean
    referralCount?: boolean
    totalCoinsEarned?: boolean
    tier?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type AmbassadorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    students?: boolean | Ambassador$studentsArgs<ExtArgs>
    _count?: boolean | AmbassadorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AmbassadorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $AmbassadorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ambassador"
    objects: {
      user: Prisma.$ProfilePayload<ExtArgs>
      students: Prisma.$StudentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      referralCode: string
      referralCount: number
      totalCoinsEarned: number
      tier: $Enums.AmbassadorTier
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["ambassador"]>
    composites: {}
  }

  type AmbassadorGetPayload<S extends boolean | null | undefined | AmbassadorDefaultArgs> = $Result.GetResult<Prisma.$AmbassadorPayload, S>

  type AmbassadorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AmbassadorFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AmbassadorCountAggregateInputType | true
    }

  export interface AmbassadorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ambassador'], meta: { name: 'Ambassador' } }
    /**
     * Find zero or one Ambassador that matches the filter.
     * @param {AmbassadorFindUniqueArgs} args - Arguments to find a Ambassador
     * @example
     * // Get one Ambassador
     * const ambassador = await prisma.ambassador.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AmbassadorFindUniqueArgs>(args: SelectSubset<T, AmbassadorFindUniqueArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Ambassador that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AmbassadorFindUniqueOrThrowArgs} args - Arguments to find a Ambassador
     * @example
     * // Get one Ambassador
     * const ambassador = await prisma.ambassador.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AmbassadorFindUniqueOrThrowArgs>(args: SelectSubset<T, AmbassadorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Ambassador that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbassadorFindFirstArgs} args - Arguments to find a Ambassador
     * @example
     * // Get one Ambassador
     * const ambassador = await prisma.ambassador.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AmbassadorFindFirstArgs>(args?: SelectSubset<T, AmbassadorFindFirstArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Ambassador that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbassadorFindFirstOrThrowArgs} args - Arguments to find a Ambassador
     * @example
     * // Get one Ambassador
     * const ambassador = await prisma.ambassador.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AmbassadorFindFirstOrThrowArgs>(args?: SelectSubset<T, AmbassadorFindFirstOrThrowArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Ambassadors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbassadorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ambassadors
     * const ambassadors = await prisma.ambassador.findMany()
     * 
     * // Get first 10 Ambassadors
     * const ambassadors = await prisma.ambassador.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ambassadorWithIdOnly = await prisma.ambassador.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AmbassadorFindManyArgs>(args?: SelectSubset<T, AmbassadorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Ambassador.
     * @param {AmbassadorCreateArgs} args - Arguments to create a Ambassador.
     * @example
     * // Create one Ambassador
     * const Ambassador = await prisma.ambassador.create({
     *   data: {
     *     // ... data to create a Ambassador
     *   }
     * })
     * 
     */
    create<T extends AmbassadorCreateArgs>(args: SelectSubset<T, AmbassadorCreateArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Ambassadors.
     * @param {AmbassadorCreateManyArgs} args - Arguments to create many Ambassadors.
     * @example
     * // Create many Ambassadors
     * const ambassador = await prisma.ambassador.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AmbassadorCreateManyArgs>(args?: SelectSubset<T, AmbassadorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ambassadors and returns the data saved in the database.
     * @param {AmbassadorCreateManyAndReturnArgs} args - Arguments to create many Ambassadors.
     * @example
     * // Create many Ambassadors
     * const ambassador = await prisma.ambassador.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ambassadors and only return the `id`
     * const ambassadorWithIdOnly = await prisma.ambassador.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AmbassadorCreateManyAndReturnArgs>(args?: SelectSubset<T, AmbassadorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Ambassador.
     * @param {AmbassadorDeleteArgs} args - Arguments to delete one Ambassador.
     * @example
     * // Delete one Ambassador
     * const Ambassador = await prisma.ambassador.delete({
     *   where: {
     *     // ... filter to delete one Ambassador
     *   }
     * })
     * 
     */
    delete<T extends AmbassadorDeleteArgs>(args: SelectSubset<T, AmbassadorDeleteArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Ambassador.
     * @param {AmbassadorUpdateArgs} args - Arguments to update one Ambassador.
     * @example
     * // Update one Ambassador
     * const ambassador = await prisma.ambassador.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AmbassadorUpdateArgs>(args: SelectSubset<T, AmbassadorUpdateArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Ambassadors.
     * @param {AmbassadorDeleteManyArgs} args - Arguments to filter Ambassadors to delete.
     * @example
     * // Delete a few Ambassadors
     * const { count } = await prisma.ambassador.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AmbassadorDeleteManyArgs>(args?: SelectSubset<T, AmbassadorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ambassadors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbassadorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ambassadors
     * const ambassador = await prisma.ambassador.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AmbassadorUpdateManyArgs>(args: SelectSubset<T, AmbassadorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Ambassador.
     * @param {AmbassadorUpsertArgs} args - Arguments to update or create a Ambassador.
     * @example
     * // Update or create a Ambassador
     * const ambassador = await prisma.ambassador.upsert({
     *   create: {
     *     // ... data to create a Ambassador
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ambassador we want to update
     *   }
     * })
     */
    upsert<T extends AmbassadorUpsertArgs>(args: SelectSubset<T, AmbassadorUpsertArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Ambassadors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbassadorCountArgs} args - Arguments to filter Ambassadors to count.
     * @example
     * // Count the number of Ambassadors
     * const count = await prisma.ambassador.count({
     *   where: {
     *     // ... the filter for the Ambassadors we want to count
     *   }
     * })
    **/
    count<T extends AmbassadorCountArgs>(
      args?: Subset<T, AmbassadorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AmbassadorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ambassador.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbassadorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AmbassadorAggregateArgs>(args: Subset<T, AmbassadorAggregateArgs>): Prisma.PrismaPromise<GetAmbassadorAggregateType<T>>

    /**
     * Group by Ambassador.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmbassadorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AmbassadorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AmbassadorGroupByArgs['orderBy'] }
        : { orderBy?: AmbassadorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AmbassadorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAmbassadorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ambassador model
   */
  readonly fields: AmbassadorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ambassador.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AmbassadorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    students<T extends Ambassador$studentsArgs<ExtArgs> = {}>(args?: Subset<T, Ambassador$studentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ambassador model
   */ 
  interface AmbassadorFieldRefs {
    readonly id: FieldRef<"Ambassador", 'String'>
    readonly userId: FieldRef<"Ambassador", 'String'>
    readonly referralCode: FieldRef<"Ambassador", 'String'>
    readonly referralCount: FieldRef<"Ambassador", 'Int'>
    readonly totalCoinsEarned: FieldRef<"Ambassador", 'Int'>
    readonly tier: FieldRef<"Ambassador", 'AmbassadorTier'>
    readonly isActive: FieldRef<"Ambassador", 'Boolean'>
    readonly createdAt: FieldRef<"Ambassador", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ambassador findUnique
   */
  export type AmbassadorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    /**
     * Filter, which Ambassador to fetch.
     */
    where: AmbassadorWhereUniqueInput
  }

  /**
   * Ambassador findUniqueOrThrow
   */
  export type AmbassadorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    /**
     * Filter, which Ambassador to fetch.
     */
    where: AmbassadorWhereUniqueInput
  }

  /**
   * Ambassador findFirst
   */
  export type AmbassadorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    /**
     * Filter, which Ambassador to fetch.
     */
    where?: AmbassadorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ambassadors to fetch.
     */
    orderBy?: AmbassadorOrderByWithRelationInput | AmbassadorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ambassadors.
     */
    cursor?: AmbassadorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ambassadors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ambassadors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ambassadors.
     */
    distinct?: AmbassadorScalarFieldEnum | AmbassadorScalarFieldEnum[]
  }

  /**
   * Ambassador findFirstOrThrow
   */
  export type AmbassadorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    /**
     * Filter, which Ambassador to fetch.
     */
    where?: AmbassadorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ambassadors to fetch.
     */
    orderBy?: AmbassadorOrderByWithRelationInput | AmbassadorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ambassadors.
     */
    cursor?: AmbassadorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ambassadors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ambassadors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ambassadors.
     */
    distinct?: AmbassadorScalarFieldEnum | AmbassadorScalarFieldEnum[]
  }

  /**
   * Ambassador findMany
   */
  export type AmbassadorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    /**
     * Filter, which Ambassadors to fetch.
     */
    where?: AmbassadorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ambassadors to fetch.
     */
    orderBy?: AmbassadorOrderByWithRelationInput | AmbassadorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ambassadors.
     */
    cursor?: AmbassadorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ambassadors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ambassadors.
     */
    skip?: number
    distinct?: AmbassadorScalarFieldEnum | AmbassadorScalarFieldEnum[]
  }

  /**
   * Ambassador create
   */
  export type AmbassadorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    /**
     * The data needed to create a Ambassador.
     */
    data: XOR<AmbassadorCreateInput, AmbassadorUncheckedCreateInput>
  }

  /**
   * Ambassador createMany
   */
  export type AmbassadorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ambassadors.
     */
    data: AmbassadorCreateManyInput | AmbassadorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ambassador createManyAndReturn
   */
  export type AmbassadorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Ambassadors.
     */
    data: AmbassadorCreateManyInput | AmbassadorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ambassador update
   */
  export type AmbassadorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    /**
     * The data needed to update a Ambassador.
     */
    data: XOR<AmbassadorUpdateInput, AmbassadorUncheckedUpdateInput>
    /**
     * Choose, which Ambassador to update.
     */
    where: AmbassadorWhereUniqueInput
  }

  /**
   * Ambassador updateMany
   */
  export type AmbassadorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ambassadors.
     */
    data: XOR<AmbassadorUpdateManyMutationInput, AmbassadorUncheckedUpdateManyInput>
    /**
     * Filter which Ambassadors to update
     */
    where?: AmbassadorWhereInput
  }

  /**
   * Ambassador upsert
   */
  export type AmbassadorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    /**
     * The filter to search for the Ambassador to update in case it exists.
     */
    where: AmbassadorWhereUniqueInput
    /**
     * In case the Ambassador found by the `where` argument doesn't exist, create a new Ambassador with this data.
     */
    create: XOR<AmbassadorCreateInput, AmbassadorUncheckedCreateInput>
    /**
     * In case the Ambassador was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AmbassadorUpdateInput, AmbassadorUncheckedUpdateInput>
  }

  /**
   * Ambassador delete
   */
  export type AmbassadorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    /**
     * Filter which Ambassador to delete.
     */
    where: AmbassadorWhereUniqueInput
  }

  /**
   * Ambassador deleteMany
   */
  export type AmbassadorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ambassadors to delete
     */
    where?: AmbassadorWhereInput
  }

  /**
   * Ambassador.students
   */
  export type Ambassador$studentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    cursor?: StudentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Ambassador without action
   */
  export type AmbassadorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
  }


  /**
   * Model Student
   */

  export type AggregateStudent = {
    _count: StudentCountAggregateOutputType | null
    _avg: StudentAvgAggregateOutputType | null
    _sum: StudentSumAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  export type StudentAvgAggregateOutputType = {
    yearOfStudy: number | null
  }

  export type StudentSumAggregateOutputType = {
    yearOfStudy: number | null
  }

  export type StudentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    college: string | null
    course: string | null
    yearOfStudy: number | null
    ambassadorCode: string | null
    referredBy: string | null
    createdAt: Date | null
  }

  export type StudentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    college: string | null
    course: string | null
    yearOfStudy: number | null
    ambassadorCode: string | null
    referredBy: string | null
    createdAt: Date | null
  }

  export type StudentCountAggregateOutputType = {
    id: number
    userId: number
    college: number
    course: number
    yearOfStudy: number
    ambassadorCode: number
    referredBy: number
    createdAt: number
    _all: number
  }


  export type StudentAvgAggregateInputType = {
    yearOfStudy?: true
  }

  export type StudentSumAggregateInputType = {
    yearOfStudy?: true
  }

  export type StudentMinAggregateInputType = {
    id?: true
    userId?: true
    college?: true
    course?: true
    yearOfStudy?: true
    ambassadorCode?: true
    referredBy?: true
    createdAt?: true
  }

  export type StudentMaxAggregateInputType = {
    id?: true
    userId?: true
    college?: true
    course?: true
    yearOfStudy?: true
    ambassadorCode?: true
    referredBy?: true
    createdAt?: true
  }

  export type StudentCountAggregateInputType = {
    id?: true
    userId?: true
    college?: true
    course?: true
    yearOfStudy?: true
    ambassadorCode?: true
    referredBy?: true
    createdAt?: true
    _all?: true
  }

  export type StudentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Student to aggregate.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Students
    **/
    _count?: true | StudentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentMaxAggregateInputType
  }

  export type GetStudentAggregateType<T extends StudentAggregateArgs> = {
        [P in keyof T & keyof AggregateStudent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudent[P]>
      : GetScalarType<T[P], AggregateStudent[P]>
  }




  export type StudentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithAggregationInput | StudentOrderByWithAggregationInput[]
    by: StudentScalarFieldEnum[] | StudentScalarFieldEnum
    having?: StudentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentCountAggregateInputType | true
    _avg?: StudentAvgAggregateInputType
    _sum?: StudentSumAggregateInputType
    _min?: StudentMinAggregateInputType
    _max?: StudentMaxAggregateInputType
  }

  export type StudentGroupByOutputType = {
    id: string
    userId: string
    college: string | null
    course: string | null
    yearOfStudy: number | null
    ambassadorCode: string | null
    referredBy: string | null
    createdAt: Date
    _count: StudentCountAggregateOutputType | null
    _avg: StudentAvgAggregateOutputType | null
    _sum: StudentSumAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  type GetStudentGroupByPayload<T extends StudentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentGroupByOutputType[P]>
            : GetScalarType<T[P], StudentGroupByOutputType[P]>
        }
      >
    >


  export type StudentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    college?: boolean
    course?: boolean
    yearOfStudy?: boolean
    ambassadorCode?: boolean
    referredBy?: boolean
    createdAt?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    referrer?: boolean | Student$referrerArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    college?: boolean
    course?: boolean
    yearOfStudy?: boolean
    ambassadorCode?: boolean
    referredBy?: boolean
    createdAt?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    referrer?: boolean | Student$referrerArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectScalar = {
    id?: boolean
    userId?: boolean
    college?: boolean
    course?: boolean
    yearOfStudy?: boolean
    ambassadorCode?: boolean
    referredBy?: boolean
    createdAt?: boolean
  }

  export type StudentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    referrer?: boolean | Student$referrerArgs<ExtArgs>
  }
  export type StudentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    referrer?: boolean | Student$referrerArgs<ExtArgs>
  }

  export type $StudentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Student"
    objects: {
      user: Prisma.$ProfilePayload<ExtArgs>
      referrer: Prisma.$AmbassadorPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      college: string | null
      course: string | null
      yearOfStudy: number | null
      ambassadorCode: string | null
      referredBy: string | null
      createdAt: Date
    }, ExtArgs["result"]["student"]>
    composites: {}
  }

  type StudentGetPayload<S extends boolean | null | undefined | StudentDefaultArgs> = $Result.GetResult<Prisma.$StudentPayload, S>

  type StudentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StudentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StudentCountAggregateInputType | true
    }

  export interface StudentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Student'], meta: { name: 'Student' } }
    /**
     * Find zero or one Student that matches the filter.
     * @param {StudentFindUniqueArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentFindUniqueArgs>(args: SelectSubset<T, StudentFindUniqueArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Student that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StudentFindUniqueOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Student that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentFindFirstArgs>(args?: SelectSubset<T, StudentFindFirstArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Student that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Students that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Students
     * const students = await prisma.student.findMany()
     * 
     * // Get first 10 Students
     * const students = await prisma.student.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentWithIdOnly = await prisma.student.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentFindManyArgs>(args?: SelectSubset<T, StudentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Student.
     * @param {StudentCreateArgs} args - Arguments to create a Student.
     * @example
     * // Create one Student
     * const Student = await prisma.student.create({
     *   data: {
     *     // ... data to create a Student
     *   }
     * })
     * 
     */
    create<T extends StudentCreateArgs>(args: SelectSubset<T, StudentCreateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Students.
     * @param {StudentCreateManyArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentCreateManyArgs>(args?: SelectSubset<T, StudentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Students and returns the data saved in the database.
     * @param {StudentCreateManyAndReturnArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Student.
     * @param {StudentDeleteArgs} args - Arguments to delete one Student.
     * @example
     * // Delete one Student
     * const Student = await prisma.student.delete({
     *   where: {
     *     // ... filter to delete one Student
     *   }
     * })
     * 
     */
    delete<T extends StudentDeleteArgs>(args: SelectSubset<T, StudentDeleteArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Student.
     * @param {StudentUpdateArgs} args - Arguments to update one Student.
     * @example
     * // Update one Student
     * const student = await prisma.student.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentUpdateArgs>(args: SelectSubset<T, StudentUpdateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Students.
     * @param {StudentDeleteManyArgs} args - Arguments to filter Students to delete.
     * @example
     * // Delete a few Students
     * const { count } = await prisma.student.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentDeleteManyArgs>(args?: SelectSubset<T, StudentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentUpdateManyArgs>(args: SelectSubset<T, StudentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Student.
     * @param {StudentUpsertArgs} args - Arguments to update or create a Student.
     * @example
     * // Update or create a Student
     * const student = await prisma.student.upsert({
     *   create: {
     *     // ... data to create a Student
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Student we want to update
     *   }
     * })
     */
    upsert<T extends StudentUpsertArgs>(args: SelectSubset<T, StudentUpsertArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCountArgs} args - Arguments to filter Students to count.
     * @example
     * // Count the number of Students
     * const count = await prisma.student.count({
     *   where: {
     *     // ... the filter for the Students we want to count
     *   }
     * })
    **/
    count<T extends StudentCountArgs>(
      args?: Subset<T, StudentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentAggregateArgs>(args: Subset<T, StudentAggregateArgs>): Prisma.PrismaPromise<GetStudentAggregateType<T>>

    /**
     * Group by Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentGroupByArgs['orderBy'] }
        : { orderBy?: StudentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Student model
   */
  readonly fields: StudentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Student.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    referrer<T extends Student$referrerArgs<ExtArgs> = {}>(args?: Subset<T, Student$referrerArgs<ExtArgs>>): Prisma__AmbassadorClient<$Result.GetResult<Prisma.$AmbassadorPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Student model
   */ 
  interface StudentFieldRefs {
    readonly id: FieldRef<"Student", 'String'>
    readonly userId: FieldRef<"Student", 'String'>
    readonly college: FieldRef<"Student", 'String'>
    readonly course: FieldRef<"Student", 'String'>
    readonly yearOfStudy: FieldRef<"Student", 'Int'>
    readonly ambassadorCode: FieldRef<"Student", 'String'>
    readonly referredBy: FieldRef<"Student", 'String'>
    readonly createdAt: FieldRef<"Student", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Student findUnique
   */
  export type StudentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findUniqueOrThrow
   */
  export type StudentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findFirst
   */
  export type StudentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findFirstOrThrow
   */
  export type StudentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findMany
   */
  export type StudentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Students to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student create
   */
  export type StudentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to create a Student.
     */
    data: XOR<StudentCreateInput, StudentUncheckedCreateInput>
  }

  /**
   * Student createMany
   */
  export type StudentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Student createManyAndReturn
   */
  export type StudentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Student update
   */
  export type StudentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to update a Student.
     */
    data: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
    /**
     * Choose, which Student to update.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student updateMany
   */
  export type StudentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
  }

  /**
   * Student upsert
   */
  export type StudentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The filter to search for the Student to update in case it exists.
     */
    where: StudentWhereUniqueInput
    /**
     * In case the Student found by the `where` argument doesn't exist, create a new Student with this data.
     */
    create: XOR<StudentCreateInput, StudentUncheckedCreateInput>
    /**
     * In case the Student was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
  }

  /**
   * Student delete
   */
  export type StudentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter which Student to delete.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student deleteMany
   */
  export type StudentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Students to delete
     */
    where?: StudentWhereInput
  }

  /**
   * Student.referrer
   */
  export type Student$referrerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ambassador
     */
    select?: AmbassadorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmbassadorInclude<ExtArgs> | null
    where?: AmbassadorWhereInput
  }

  /**
   * Student without action
   */
  export type StudentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    body: string | null
    type: string | null
    referenceId: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    body: string | null
    type: string | null
    referenceId: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    body: number
    type: number
    referenceId: number
    isRead: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    body?: true
    type?: true
    referenceId?: true
    isRead?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    body?: true
    type?: true
    referenceId?: true
    isRead?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    body?: true
    type?: true
    referenceId?: true
    isRead?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    title: string
    body: string
    type: string
    referenceId: string | null
    isRead: boolean
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    body?: boolean
    type?: boolean
    referenceId?: boolean
    isRead?: boolean
    createdAt?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    body?: boolean
    type?: boolean
    referenceId?: boolean
    isRead?: boolean
    createdAt?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    body?: boolean
    type?: boolean
    referenceId?: boolean
    isRead?: boolean
    createdAt?: boolean
  }

  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      body: string
      type: string
      referenceId: string | null
      isRead: boolean
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */ 
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly body: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly referenceId: FieldRef<"Notification", 'String'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProfileScalarFieldEnum: {
    id: 'id',
    email: 'email',
    fullName: 'fullName',
    avatarUrl: 'avatarUrl',
    role: 'role',
    phone: 'phone',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const CompanyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    logoUrl: 'logoUrl',
    website: 'website',
    industry: 'industry',
    description: 'description',
    contactPersonId: 'contactPersonId',
    isVerified: 'isVerified',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    companyId: 'companyId',
    eventDate: 'eventDate',
    eventTime: 'eventTime',
    location: 'location',
    locationUrl: 'locationUrl',
    category: 'category',
    bannerUrl: 'bannerUrl',
    maxAttendees: 'maxAttendees',
    currentAttendees: 'currentAttendees',
    status: 'status',
    requirements: 'requirements',
    coinReward: 'coinReward',
    createdBy: 'createdBy',
    approvedBy: 'approvedBy',
    approvedAt: 'approvedAt',
    rejectionReason: 'rejectionReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const EventRequirementScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    label: 'label',
    createdAt: 'createdAt'
  };

  export type EventRequirementScalarFieldEnum = (typeof EventRequirementScalarFieldEnum)[keyof typeof EventRequirementScalarFieldEnum]


  export const EventApplicationScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    userId: 'userId',
    status: 'status',
    note: 'note',
    appliedAt: 'appliedAt',
    reviewedAt: 'reviewedAt',
    reviewedBy: 'reviewedBy'
  };

  export type EventApplicationScalarFieldEnum = (typeof EventApplicationScalarFieldEnum)[keyof typeof EventApplicationScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    eventId: 'eventId',
    assignedTo: 'assignedTo',
    assignedBy: 'assignedBy',
    status: 'status',
    dueDate: 'dueDate',
    coinValue: 'coinValue',
    submissionUrl: 'submissionUrl',
    submissionNote: 'submissionNote',
    submittedAt: 'submittedAt',
    reviewedAt: 'reviewedAt',
    reviewNote: 'reviewNote',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const WalletBalanceScalarFieldEnum: {
    userId: 'userId',
    totalEarned: 'totalEarned',
    totalRedeemed: 'totalRedeemed',
    currentBalance: 'currentBalance'
  };

  export type WalletBalanceScalarFieldEnum = (typeof WalletBalanceScalarFieldEnum)[keyof typeof WalletBalanceScalarFieldEnum]


  export const CoinTransactionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    amount: 'amount',
    description: 'description',
    referenceId: 'referenceId',
    referenceType: 'referenceType',
    createdAt: 'createdAt'
  };

  export type CoinTransactionScalarFieldEnum = (typeof CoinTransactionScalarFieldEnum)[keyof typeof CoinTransactionScalarFieldEnum]


  export const AmbassadorScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    referralCode: 'referralCode',
    referralCount: 'referralCount',
    totalCoinsEarned: 'totalCoinsEarned',
    tier: 'tier',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type AmbassadorScalarFieldEnum = (typeof AmbassadorScalarFieldEnum)[keyof typeof AmbassadorScalarFieldEnum]


  export const StudentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    college: 'college',
    course: 'course',
    yearOfStudy: 'yearOfStudy',
    ambassadorCode: 'ambassadorCode',
    referredBy: 'referredBy',
    createdAt: 'createdAt'
  };

  export type StudentScalarFieldEnum = (typeof StudentScalarFieldEnum)[keyof typeof StudentScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    body: 'body',
    type: 'type',
    referenceId: 'referenceId',
    isRead: 'isRead',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'EventStatus'
   */
  export type EnumEventStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EventStatus'>
    


  /**
   * Reference to a field of type 'EventStatus[]'
   */
  export type ListEnumEventStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EventStatus[]'>
    


  /**
   * Reference to a field of type 'ApplicationStatus'
   */
  export type EnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus'>
    


  /**
   * Reference to a field of type 'ApplicationStatus[]'
   */
  export type ListEnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus[]'>
    


  /**
   * Reference to a field of type 'TaskStatus'
   */
  export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>
    


  /**
   * Reference to a field of type 'TaskStatus[]'
   */
  export type ListEnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus[]'>
    


  /**
   * Reference to a field of type 'TransactionType'
   */
  export type EnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType'>
    


  /**
   * Reference to a field of type 'TransactionType[]'
   */
  export type ListEnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType[]'>
    


  /**
   * Reference to a field of type 'AmbassadorTier'
   */
  export type EnumAmbassadorTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AmbassadorTier'>
    


  /**
   * Reference to a field of type 'AmbassadorTier[]'
   */
  export type ListEnumAmbassadorTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AmbassadorTier[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: UuidFilter<"Profile"> | string
    email?: StringFilter<"Profile"> | string
    fullName?: StringFilter<"Profile"> | string
    avatarUrl?: StringNullableFilter<"Profile"> | string | null
    role?: EnumUserRoleFilter<"Profile"> | $Enums.UserRole
    phone?: StringNullableFilter<"Profile"> | string | null
    isActive?: BoolFilter<"Profile"> | boolean
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    companiesOwned?: CompanyListRelationFilter
    eventsCreated?: EventListRelationFilter
    eventsApproved?: EventListRelationFilter
    eventApplications?: EventApplicationListRelationFilter
    reviewedApplications?: EventApplicationListRelationFilter
    tasksAssigned?: TaskListRelationFilter
    tasksCreated?: TaskListRelationFilter
    coinTransactions?: CoinTransactionListRelationFilter
    walletBalance?: XOR<WalletBalanceNullableRelationFilter, WalletBalanceWhereInput> | null
    ambassador?: XOR<AmbassadorNullableRelationFilter, AmbassadorWhereInput> | null
    student?: XOR<StudentNullableRelationFilter, StudentWhereInput> | null
    notifications?: NotificationListRelationFilter
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    role?: SortOrder
    phone?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    companiesOwned?: CompanyOrderByRelationAggregateInput
    eventsCreated?: EventOrderByRelationAggregateInput
    eventsApproved?: EventOrderByRelationAggregateInput
    eventApplications?: EventApplicationOrderByRelationAggregateInput
    reviewedApplications?: EventApplicationOrderByRelationAggregateInput
    tasksAssigned?: TaskOrderByRelationAggregateInput
    tasksCreated?: TaskOrderByRelationAggregateInput
    coinTransactions?: CoinTransactionOrderByRelationAggregateInput
    walletBalance?: WalletBalanceOrderByWithRelationInput
    ambassador?: AmbassadorOrderByWithRelationInput
    student?: StudentOrderByWithRelationInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    email?: StringFilter<"Profile"> | string
    fullName?: StringFilter<"Profile"> | string
    avatarUrl?: StringNullableFilter<"Profile"> | string | null
    role?: EnumUserRoleFilter<"Profile"> | $Enums.UserRole
    phone?: StringNullableFilter<"Profile"> | string | null
    isActive?: BoolFilter<"Profile"> | boolean
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    companiesOwned?: CompanyListRelationFilter
    eventsCreated?: EventListRelationFilter
    eventsApproved?: EventListRelationFilter
    eventApplications?: EventApplicationListRelationFilter
    reviewedApplications?: EventApplicationListRelationFilter
    tasksAssigned?: TaskListRelationFilter
    tasksCreated?: TaskListRelationFilter
    coinTransactions?: CoinTransactionListRelationFilter
    walletBalance?: XOR<WalletBalanceNullableRelationFilter, WalletBalanceWhereInput> | null
    ambassador?: XOR<AmbassadorNullableRelationFilter, AmbassadorWhereInput> | null
    student?: XOR<StudentNullableRelationFilter, StudentWhereInput> | null
    notifications?: NotificationListRelationFilter
  }, "id">

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    role?: SortOrder
    phone?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Profile"> | string
    email?: StringWithAggregatesFilter<"Profile"> | string
    fullName?: StringWithAggregatesFilter<"Profile"> | string
    avatarUrl?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"Profile"> | $Enums.UserRole
    phone?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    isActive?: BoolWithAggregatesFilter<"Profile"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
  }

  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    id?: UuidFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    logoUrl?: StringNullableFilter<"Company"> | string | null
    website?: StringNullableFilter<"Company"> | string | null
    industry?: StringNullableFilter<"Company"> | string | null
    description?: StringNullableFilter<"Company"> | string | null
    contactPersonId?: UuidFilter<"Company"> | string
    isVerified?: BoolFilter<"Company"> | boolean
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    contactPerson?: XOR<ProfileRelationFilter, ProfileWhereInput>
    events?: EventListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    industry?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    contactPersonId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contactPerson?: ProfileOrderByWithRelationInput
    events?: EventOrderByRelationAggregateInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    name?: StringFilter<"Company"> | string
    logoUrl?: StringNullableFilter<"Company"> | string | null
    website?: StringNullableFilter<"Company"> | string | null
    industry?: StringNullableFilter<"Company"> | string | null
    description?: StringNullableFilter<"Company"> | string | null
    contactPersonId?: UuidFilter<"Company"> | string
    isVerified?: BoolFilter<"Company"> | boolean
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    contactPerson?: XOR<ProfileRelationFilter, ProfileWhereInput>
    events?: EventListRelationFilter
  }, "id">

  export type CompanyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    industry?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    contactPersonId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Company"> | string
    name?: StringWithAggregatesFilter<"Company"> | string
    logoUrl?: StringNullableWithAggregatesFilter<"Company"> | string | null
    website?: StringNullableWithAggregatesFilter<"Company"> | string | null
    industry?: StringNullableWithAggregatesFilter<"Company"> | string | null
    description?: StringNullableWithAggregatesFilter<"Company"> | string | null
    contactPersonId?: UuidWithAggregatesFilter<"Company"> | string
    isVerified?: BoolWithAggregatesFilter<"Company"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: UuidFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    description?: StringFilter<"Event"> | string
    companyId?: UuidFilter<"Event"> | string
    eventDate?: DateTimeFilter<"Event"> | Date | string
    eventTime?: DateTimeNullableFilter<"Event"> | Date | string | null
    location?: StringFilter<"Event"> | string
    locationUrl?: StringNullableFilter<"Event"> | string | null
    category?: StringFilter<"Event"> | string
    bannerUrl?: StringNullableFilter<"Event"> | string | null
    maxAttendees?: IntNullableFilter<"Event"> | number | null
    currentAttendees?: IntFilter<"Event"> | number
    status?: EnumEventStatusFilter<"Event"> | $Enums.EventStatus
    requirements?: StringNullableFilter<"Event"> | string | null
    coinReward?: IntFilter<"Event"> | number
    createdBy?: UuidFilter<"Event"> | string
    approvedBy?: UuidNullableFilter<"Event"> | string | null
    approvedAt?: DateTimeNullableFilter<"Event"> | Date | string | null
    rejectionReason?: StringNullableFilter<"Event"> | string | null
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    creator?: XOR<ProfileRelationFilter, ProfileWhereInput>
    approver?: XOR<ProfileNullableRelationFilter, ProfileWhereInput> | null
    requirements_list?: EventRequirementListRelationFilter
    applications?: EventApplicationListRelationFilter
    tasks?: TaskListRelationFilter
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    companyId?: SortOrder
    eventDate?: SortOrder
    eventTime?: SortOrderInput | SortOrder
    location?: SortOrder
    locationUrl?: SortOrderInput | SortOrder
    category?: SortOrder
    bannerUrl?: SortOrderInput | SortOrder
    maxAttendees?: SortOrderInput | SortOrder
    currentAttendees?: SortOrder
    status?: SortOrder
    requirements?: SortOrderInput | SortOrder
    coinReward?: SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
    creator?: ProfileOrderByWithRelationInput
    approver?: ProfileOrderByWithRelationInput
    requirements_list?: EventRequirementOrderByRelationAggregateInput
    applications?: EventApplicationOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    title?: StringFilter<"Event"> | string
    description?: StringFilter<"Event"> | string
    companyId?: UuidFilter<"Event"> | string
    eventDate?: DateTimeFilter<"Event"> | Date | string
    eventTime?: DateTimeNullableFilter<"Event"> | Date | string | null
    location?: StringFilter<"Event"> | string
    locationUrl?: StringNullableFilter<"Event"> | string | null
    category?: StringFilter<"Event"> | string
    bannerUrl?: StringNullableFilter<"Event"> | string | null
    maxAttendees?: IntNullableFilter<"Event"> | number | null
    currentAttendees?: IntFilter<"Event"> | number
    status?: EnumEventStatusFilter<"Event"> | $Enums.EventStatus
    requirements?: StringNullableFilter<"Event"> | string | null
    coinReward?: IntFilter<"Event"> | number
    createdBy?: UuidFilter<"Event"> | string
    approvedBy?: UuidNullableFilter<"Event"> | string | null
    approvedAt?: DateTimeNullableFilter<"Event"> | Date | string | null
    rejectionReason?: StringNullableFilter<"Event"> | string | null
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    creator?: XOR<ProfileRelationFilter, ProfileWhereInput>
    approver?: XOR<ProfileNullableRelationFilter, ProfileWhereInput> | null
    requirements_list?: EventRequirementListRelationFilter
    applications?: EventApplicationListRelationFilter
    tasks?: TaskListRelationFilter
  }, "id">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    companyId?: SortOrder
    eventDate?: SortOrder
    eventTime?: SortOrderInput | SortOrder
    location?: SortOrder
    locationUrl?: SortOrderInput | SortOrder
    category?: SortOrder
    bannerUrl?: SortOrderInput | SortOrder
    maxAttendees?: SortOrderInput | SortOrder
    currentAttendees?: SortOrder
    status?: SortOrder
    requirements?: SortOrderInput | SortOrder
    coinReward?: SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Event"> | string
    title?: StringWithAggregatesFilter<"Event"> | string
    description?: StringWithAggregatesFilter<"Event"> | string
    companyId?: UuidWithAggregatesFilter<"Event"> | string
    eventDate?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    eventTime?: DateTimeNullableWithAggregatesFilter<"Event"> | Date | string | null
    location?: StringWithAggregatesFilter<"Event"> | string
    locationUrl?: StringNullableWithAggregatesFilter<"Event"> | string | null
    category?: StringWithAggregatesFilter<"Event"> | string
    bannerUrl?: StringNullableWithAggregatesFilter<"Event"> | string | null
    maxAttendees?: IntNullableWithAggregatesFilter<"Event"> | number | null
    currentAttendees?: IntWithAggregatesFilter<"Event"> | number
    status?: EnumEventStatusWithAggregatesFilter<"Event"> | $Enums.EventStatus
    requirements?: StringNullableWithAggregatesFilter<"Event"> | string | null
    coinReward?: IntWithAggregatesFilter<"Event"> | number
    createdBy?: UuidWithAggregatesFilter<"Event"> | string
    approvedBy?: UuidNullableWithAggregatesFilter<"Event"> | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"Event"> | Date | string | null
    rejectionReason?: StringNullableWithAggregatesFilter<"Event"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
  }

  export type EventRequirementWhereInput = {
    AND?: EventRequirementWhereInput | EventRequirementWhereInput[]
    OR?: EventRequirementWhereInput[]
    NOT?: EventRequirementWhereInput | EventRequirementWhereInput[]
    id?: UuidFilter<"EventRequirement"> | string
    eventId?: UuidFilter<"EventRequirement"> | string
    label?: StringFilter<"EventRequirement"> | string
    createdAt?: DateTimeFilter<"EventRequirement"> | Date | string
    event?: XOR<EventRelationFilter, EventWhereInput>
  }

  export type EventRequirementOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type EventRequirementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventRequirementWhereInput | EventRequirementWhereInput[]
    OR?: EventRequirementWhereInput[]
    NOT?: EventRequirementWhereInput | EventRequirementWhereInput[]
    eventId?: UuidFilter<"EventRequirement"> | string
    label?: StringFilter<"EventRequirement"> | string
    createdAt?: DateTimeFilter<"EventRequirement"> | Date | string
    event?: XOR<EventRelationFilter, EventWhereInput>
  }, "id">

  export type EventRequirementOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
    _count?: EventRequirementCountOrderByAggregateInput
    _max?: EventRequirementMaxOrderByAggregateInput
    _min?: EventRequirementMinOrderByAggregateInput
  }

  export type EventRequirementScalarWhereWithAggregatesInput = {
    AND?: EventRequirementScalarWhereWithAggregatesInput | EventRequirementScalarWhereWithAggregatesInput[]
    OR?: EventRequirementScalarWhereWithAggregatesInput[]
    NOT?: EventRequirementScalarWhereWithAggregatesInput | EventRequirementScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"EventRequirement"> | string
    eventId?: UuidWithAggregatesFilter<"EventRequirement"> | string
    label?: StringWithAggregatesFilter<"EventRequirement"> | string
    createdAt?: DateTimeWithAggregatesFilter<"EventRequirement"> | Date | string
  }

  export type EventApplicationWhereInput = {
    AND?: EventApplicationWhereInput | EventApplicationWhereInput[]
    OR?: EventApplicationWhereInput[]
    NOT?: EventApplicationWhereInput | EventApplicationWhereInput[]
    id?: UuidFilter<"EventApplication"> | string
    eventId?: UuidFilter<"EventApplication"> | string
    userId?: UuidFilter<"EventApplication"> | string
    status?: EnumApplicationStatusFilter<"EventApplication"> | $Enums.ApplicationStatus
    note?: StringNullableFilter<"EventApplication"> | string | null
    appliedAt?: DateTimeFilter<"EventApplication"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"EventApplication"> | Date | string | null
    reviewedBy?: UuidNullableFilter<"EventApplication"> | string | null
    event?: XOR<EventRelationFilter, EventWhereInput>
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
    reviewer?: XOR<ProfileNullableRelationFilter, ProfileWhereInput> | null
  }

  export type EventApplicationOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    note?: SortOrderInput | SortOrder
    appliedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    event?: EventOrderByWithRelationInput
    user?: ProfileOrderByWithRelationInput
    reviewer?: ProfileOrderByWithRelationInput
  }

  export type EventApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId_userId?: EventApplicationEventIdUserIdCompoundUniqueInput
    AND?: EventApplicationWhereInput | EventApplicationWhereInput[]
    OR?: EventApplicationWhereInput[]
    NOT?: EventApplicationWhereInput | EventApplicationWhereInput[]
    eventId?: UuidFilter<"EventApplication"> | string
    userId?: UuidFilter<"EventApplication"> | string
    status?: EnumApplicationStatusFilter<"EventApplication"> | $Enums.ApplicationStatus
    note?: StringNullableFilter<"EventApplication"> | string | null
    appliedAt?: DateTimeFilter<"EventApplication"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"EventApplication"> | Date | string | null
    reviewedBy?: UuidNullableFilter<"EventApplication"> | string | null
    event?: XOR<EventRelationFilter, EventWhereInput>
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
    reviewer?: XOR<ProfileNullableRelationFilter, ProfileWhereInput> | null
  }, "id" | "eventId_userId">

  export type EventApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    note?: SortOrderInput | SortOrder
    appliedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    _count?: EventApplicationCountOrderByAggregateInput
    _max?: EventApplicationMaxOrderByAggregateInput
    _min?: EventApplicationMinOrderByAggregateInput
  }

  export type EventApplicationScalarWhereWithAggregatesInput = {
    AND?: EventApplicationScalarWhereWithAggregatesInput | EventApplicationScalarWhereWithAggregatesInput[]
    OR?: EventApplicationScalarWhereWithAggregatesInput[]
    NOT?: EventApplicationScalarWhereWithAggregatesInput | EventApplicationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"EventApplication"> | string
    eventId?: UuidWithAggregatesFilter<"EventApplication"> | string
    userId?: UuidWithAggregatesFilter<"EventApplication"> | string
    status?: EnumApplicationStatusWithAggregatesFilter<"EventApplication"> | $Enums.ApplicationStatus
    note?: StringNullableWithAggregatesFilter<"EventApplication"> | string | null
    appliedAt?: DateTimeWithAggregatesFilter<"EventApplication"> | Date | string
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"EventApplication"> | Date | string | null
    reviewedBy?: UuidNullableWithAggregatesFilter<"EventApplication"> | string | null
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: UuidFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringFilter<"Task"> | string
    eventId?: UuidNullableFilter<"Task"> | string | null
    assignedTo?: UuidFilter<"Task"> | string
    assignedBy?: UuidFilter<"Task"> | string
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    coinValue?: IntFilter<"Task"> | number
    submissionUrl?: StringNullableFilter<"Task"> | string | null
    submissionNote?: StringNullableFilter<"Task"> | string | null
    submittedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    reviewedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    reviewNote?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    event?: XOR<EventNullableRelationFilter, EventWhereInput> | null
    assignee?: XOR<ProfileRelationFilter, ProfileWhereInput>
    assigner?: XOR<ProfileRelationFilter, ProfileWhereInput>
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventId?: SortOrderInput | SortOrder
    assignedTo?: SortOrder
    assignedBy?: SortOrder
    status?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    coinValue?: SortOrder
    submissionUrl?: SortOrderInput | SortOrder
    submissionNote?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    event?: EventOrderByWithRelationInput
    assignee?: ProfileOrderByWithRelationInput
    assigner?: ProfileOrderByWithRelationInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    title?: StringFilter<"Task"> | string
    description?: StringFilter<"Task"> | string
    eventId?: UuidNullableFilter<"Task"> | string | null
    assignedTo?: UuidFilter<"Task"> | string
    assignedBy?: UuidFilter<"Task"> | string
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    coinValue?: IntFilter<"Task"> | number
    submissionUrl?: StringNullableFilter<"Task"> | string | null
    submissionNote?: StringNullableFilter<"Task"> | string | null
    submittedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    reviewedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    reviewNote?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    event?: XOR<EventNullableRelationFilter, EventWhereInput> | null
    assignee?: XOR<ProfileRelationFilter, ProfileWhereInput>
    assigner?: XOR<ProfileRelationFilter, ProfileWhereInput>
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventId?: SortOrderInput | SortOrder
    assignedTo?: SortOrder
    assignedBy?: SortOrder
    status?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    coinValue?: SortOrder
    submissionUrl?: SortOrderInput | SortOrder
    submissionNote?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _avg?: TaskAvgOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
    _sum?: TaskSumOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringWithAggregatesFilter<"Task"> | string
    eventId?: UuidNullableWithAggregatesFilter<"Task"> | string | null
    assignedTo?: UuidWithAggregatesFilter<"Task"> | string
    assignedBy?: UuidWithAggregatesFilter<"Task"> | string
    status?: EnumTaskStatusWithAggregatesFilter<"Task"> | $Enums.TaskStatus
    dueDate?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    coinValue?: IntWithAggregatesFilter<"Task"> | number
    submissionUrl?: StringNullableWithAggregatesFilter<"Task"> | string | null
    submissionNote?: StringNullableWithAggregatesFilter<"Task"> | string | null
    submittedAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    reviewNote?: StringNullableWithAggregatesFilter<"Task"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
  }

  export type WalletBalanceWhereInput = {
    AND?: WalletBalanceWhereInput | WalletBalanceWhereInput[]
    OR?: WalletBalanceWhereInput[]
    NOT?: WalletBalanceWhereInput | WalletBalanceWhereInput[]
    userId?: UuidFilter<"WalletBalance"> | string
    totalEarned?: IntFilter<"WalletBalance"> | number
    totalRedeemed?: IntFilter<"WalletBalance"> | number
    currentBalance?: IntFilter<"WalletBalance"> | number
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
  }

  export type WalletBalanceOrderByWithRelationInput = {
    userId?: SortOrder
    totalEarned?: SortOrder
    totalRedeemed?: SortOrder
    currentBalance?: SortOrder
    user?: ProfileOrderByWithRelationInput
  }

  export type WalletBalanceWhereUniqueInput = Prisma.AtLeast<{
    userId?: string
    AND?: WalletBalanceWhereInput | WalletBalanceWhereInput[]
    OR?: WalletBalanceWhereInput[]
    NOT?: WalletBalanceWhereInput | WalletBalanceWhereInput[]
    totalEarned?: IntFilter<"WalletBalance"> | number
    totalRedeemed?: IntFilter<"WalletBalance"> | number
    currentBalance?: IntFilter<"WalletBalance"> | number
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
  }, "userId">

  export type WalletBalanceOrderByWithAggregationInput = {
    userId?: SortOrder
    totalEarned?: SortOrder
    totalRedeemed?: SortOrder
    currentBalance?: SortOrder
    _count?: WalletBalanceCountOrderByAggregateInput
    _avg?: WalletBalanceAvgOrderByAggregateInput
    _max?: WalletBalanceMaxOrderByAggregateInput
    _min?: WalletBalanceMinOrderByAggregateInput
    _sum?: WalletBalanceSumOrderByAggregateInput
  }

  export type WalletBalanceScalarWhereWithAggregatesInput = {
    AND?: WalletBalanceScalarWhereWithAggregatesInput | WalletBalanceScalarWhereWithAggregatesInput[]
    OR?: WalletBalanceScalarWhereWithAggregatesInput[]
    NOT?: WalletBalanceScalarWhereWithAggregatesInput | WalletBalanceScalarWhereWithAggregatesInput[]
    userId?: UuidWithAggregatesFilter<"WalletBalance"> | string
    totalEarned?: IntWithAggregatesFilter<"WalletBalance"> | number
    totalRedeemed?: IntWithAggregatesFilter<"WalletBalance"> | number
    currentBalance?: IntWithAggregatesFilter<"WalletBalance"> | number
  }

  export type CoinTransactionWhereInput = {
    AND?: CoinTransactionWhereInput | CoinTransactionWhereInput[]
    OR?: CoinTransactionWhereInput[]
    NOT?: CoinTransactionWhereInput | CoinTransactionWhereInput[]
    id?: UuidFilter<"CoinTransaction"> | string
    userId?: UuidFilter<"CoinTransaction"> | string
    type?: EnumTransactionTypeFilter<"CoinTransaction"> | $Enums.TransactionType
    amount?: IntFilter<"CoinTransaction"> | number
    description?: StringFilter<"CoinTransaction"> | string
    referenceId?: StringNullableFilter<"CoinTransaction"> | string | null
    referenceType?: StringNullableFilter<"CoinTransaction"> | string | null
    createdAt?: DateTimeFilter<"CoinTransaction"> | Date | string
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
  }

  export type CoinTransactionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    referenceType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: ProfileOrderByWithRelationInput
  }

  export type CoinTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CoinTransactionWhereInput | CoinTransactionWhereInput[]
    OR?: CoinTransactionWhereInput[]
    NOT?: CoinTransactionWhereInput | CoinTransactionWhereInput[]
    userId?: UuidFilter<"CoinTransaction"> | string
    type?: EnumTransactionTypeFilter<"CoinTransaction"> | $Enums.TransactionType
    amount?: IntFilter<"CoinTransaction"> | number
    description?: StringFilter<"CoinTransaction"> | string
    referenceId?: StringNullableFilter<"CoinTransaction"> | string | null
    referenceType?: StringNullableFilter<"CoinTransaction"> | string | null
    createdAt?: DateTimeFilter<"CoinTransaction"> | Date | string
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
  }, "id">

  export type CoinTransactionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    referenceType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CoinTransactionCountOrderByAggregateInput
    _avg?: CoinTransactionAvgOrderByAggregateInput
    _max?: CoinTransactionMaxOrderByAggregateInput
    _min?: CoinTransactionMinOrderByAggregateInput
    _sum?: CoinTransactionSumOrderByAggregateInput
  }

  export type CoinTransactionScalarWhereWithAggregatesInput = {
    AND?: CoinTransactionScalarWhereWithAggregatesInput | CoinTransactionScalarWhereWithAggregatesInput[]
    OR?: CoinTransactionScalarWhereWithAggregatesInput[]
    NOT?: CoinTransactionScalarWhereWithAggregatesInput | CoinTransactionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CoinTransaction"> | string
    userId?: UuidWithAggregatesFilter<"CoinTransaction"> | string
    type?: EnumTransactionTypeWithAggregatesFilter<"CoinTransaction"> | $Enums.TransactionType
    amount?: IntWithAggregatesFilter<"CoinTransaction"> | number
    description?: StringWithAggregatesFilter<"CoinTransaction"> | string
    referenceId?: StringNullableWithAggregatesFilter<"CoinTransaction"> | string | null
    referenceType?: StringNullableWithAggregatesFilter<"CoinTransaction"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CoinTransaction"> | Date | string
  }

  export type AmbassadorWhereInput = {
    AND?: AmbassadorWhereInput | AmbassadorWhereInput[]
    OR?: AmbassadorWhereInput[]
    NOT?: AmbassadorWhereInput | AmbassadorWhereInput[]
    id?: UuidFilter<"Ambassador"> | string
    userId?: UuidFilter<"Ambassador"> | string
    referralCode?: StringFilter<"Ambassador"> | string
    referralCount?: IntFilter<"Ambassador"> | number
    totalCoinsEarned?: IntFilter<"Ambassador"> | number
    tier?: EnumAmbassadorTierFilter<"Ambassador"> | $Enums.AmbassadorTier
    isActive?: BoolFilter<"Ambassador"> | boolean
    createdAt?: DateTimeFilter<"Ambassador"> | Date | string
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
    students?: StudentListRelationFilter
  }

  export type AmbassadorOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    referralCode?: SortOrder
    referralCount?: SortOrder
    totalCoinsEarned?: SortOrder
    tier?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    user?: ProfileOrderByWithRelationInput
    students?: StudentOrderByRelationAggregateInput
  }

  export type AmbassadorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    referralCode?: string
    AND?: AmbassadorWhereInput | AmbassadorWhereInput[]
    OR?: AmbassadorWhereInput[]
    NOT?: AmbassadorWhereInput | AmbassadorWhereInput[]
    referralCount?: IntFilter<"Ambassador"> | number
    totalCoinsEarned?: IntFilter<"Ambassador"> | number
    tier?: EnumAmbassadorTierFilter<"Ambassador"> | $Enums.AmbassadorTier
    isActive?: BoolFilter<"Ambassador"> | boolean
    createdAt?: DateTimeFilter<"Ambassador"> | Date | string
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
    students?: StudentListRelationFilter
  }, "id" | "userId" | "referralCode">

  export type AmbassadorOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    referralCode?: SortOrder
    referralCount?: SortOrder
    totalCoinsEarned?: SortOrder
    tier?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: AmbassadorCountOrderByAggregateInput
    _avg?: AmbassadorAvgOrderByAggregateInput
    _max?: AmbassadorMaxOrderByAggregateInput
    _min?: AmbassadorMinOrderByAggregateInput
    _sum?: AmbassadorSumOrderByAggregateInput
  }

  export type AmbassadorScalarWhereWithAggregatesInput = {
    AND?: AmbassadorScalarWhereWithAggregatesInput | AmbassadorScalarWhereWithAggregatesInput[]
    OR?: AmbassadorScalarWhereWithAggregatesInput[]
    NOT?: AmbassadorScalarWhereWithAggregatesInput | AmbassadorScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Ambassador"> | string
    userId?: UuidWithAggregatesFilter<"Ambassador"> | string
    referralCode?: StringWithAggregatesFilter<"Ambassador"> | string
    referralCount?: IntWithAggregatesFilter<"Ambassador"> | number
    totalCoinsEarned?: IntWithAggregatesFilter<"Ambassador"> | number
    tier?: EnumAmbassadorTierWithAggregatesFilter<"Ambassador"> | $Enums.AmbassadorTier
    isActive?: BoolWithAggregatesFilter<"Ambassador"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Ambassador"> | Date | string
  }

  export type StudentWhereInput = {
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    id?: UuidFilter<"Student"> | string
    userId?: UuidFilter<"Student"> | string
    college?: StringNullableFilter<"Student"> | string | null
    course?: StringNullableFilter<"Student"> | string | null
    yearOfStudy?: IntNullableFilter<"Student"> | number | null
    ambassadorCode?: StringNullableFilter<"Student"> | string | null
    referredBy?: UuidNullableFilter<"Student"> | string | null
    createdAt?: DateTimeFilter<"Student"> | Date | string
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
    referrer?: XOR<AmbassadorNullableRelationFilter, AmbassadorWhereInput> | null
  }

  export type StudentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    college?: SortOrderInput | SortOrder
    course?: SortOrderInput | SortOrder
    yearOfStudy?: SortOrderInput | SortOrder
    ambassadorCode?: SortOrderInput | SortOrder
    referredBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: ProfileOrderByWithRelationInput
    referrer?: AmbassadorOrderByWithRelationInput
  }

  export type StudentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    college?: StringNullableFilter<"Student"> | string | null
    course?: StringNullableFilter<"Student"> | string | null
    yearOfStudy?: IntNullableFilter<"Student"> | number | null
    ambassadorCode?: StringNullableFilter<"Student"> | string | null
    referredBy?: UuidNullableFilter<"Student"> | string | null
    createdAt?: DateTimeFilter<"Student"> | Date | string
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
    referrer?: XOR<AmbassadorNullableRelationFilter, AmbassadorWhereInput> | null
  }, "id" | "userId">

  export type StudentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    college?: SortOrderInput | SortOrder
    course?: SortOrderInput | SortOrder
    yearOfStudy?: SortOrderInput | SortOrder
    ambassadorCode?: SortOrderInput | SortOrder
    referredBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: StudentCountOrderByAggregateInput
    _avg?: StudentAvgOrderByAggregateInput
    _max?: StudentMaxOrderByAggregateInput
    _min?: StudentMinOrderByAggregateInput
    _sum?: StudentSumOrderByAggregateInput
  }

  export type StudentScalarWhereWithAggregatesInput = {
    AND?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    OR?: StudentScalarWhereWithAggregatesInput[]
    NOT?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Student"> | string
    userId?: UuidWithAggregatesFilter<"Student"> | string
    college?: StringNullableWithAggregatesFilter<"Student"> | string | null
    course?: StringNullableWithAggregatesFilter<"Student"> | string | null
    yearOfStudy?: IntNullableWithAggregatesFilter<"Student"> | number | null
    ambassadorCode?: StringNullableWithAggregatesFilter<"Student"> | string | null
    referredBy?: UuidNullableWithAggregatesFilter<"Student"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: UuidFilter<"Notification"> | string
    userId?: UuidFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    referenceId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    user?: ProfileOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: UuidFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    referenceId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<ProfileRelationFilter, ProfileWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Notification"> | string
    userId?: UuidWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    body?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    referenceId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type ProfileCreateInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProfileCreateManyInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyCreateInput = {
    id?: string
    name: string
    logoUrl?: string | null
    website?: string | null
    industry?: string | null
    description?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    contactPerson: ProfileCreateNestedOneWithoutCompaniesOwnedInput
    events?: EventCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    id?: string
    name: string
    logoUrl?: string | null
    website?: string | null
    industry?: string | null
    description?: string | null
    contactPersonId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contactPerson?: ProfileUpdateOneRequiredWithoutCompaniesOwnedNestedInput
    events?: EventUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    contactPersonId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    id?: string
    name: string
    logoUrl?: string | null
    website?: string | null
    industry?: string | null
    description?: string | null
    contactPersonId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    contactPersonId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateInput = {
    id?: string
    title: string
    description: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutEventsInput
    creator: ProfileCreateNestedOneWithoutEventsCreatedInput
    approver?: ProfileCreateNestedOneWithoutEventsApprovedInput
    requirements_list?: EventRequirementCreateNestedManyWithoutEventInput
    applications?: EventApplicationCreateNestedManyWithoutEventInput
    tasks?: TaskCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    companyId: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements_list?: EventRequirementUncheckedCreateNestedManyWithoutEventInput
    applications?: EventApplicationUncheckedCreateNestedManyWithoutEventInput
    tasks?: TaskUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutEventsNestedInput
    creator?: ProfileUpdateOneRequiredWithoutEventsCreatedNestedInput
    approver?: ProfileUpdateOneWithoutEventsApprovedNestedInput
    requirements_list?: EventRequirementUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUpdateManyWithoutEventNestedInput
    tasks?: TaskUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements_list?: EventRequirementUncheckedUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUncheckedUpdateManyWithoutEventNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: string
    title: string
    description: string
    companyId: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventRequirementCreateInput = {
    id?: string
    label: string
    createdAt?: Date | string
    event: EventCreateNestedOneWithoutRequirements_listInput
  }

  export type EventRequirementUncheckedCreateInput = {
    id?: string
    eventId: string
    label: string
    createdAt?: Date | string
  }

  export type EventRequirementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutRequirements_listNestedInput
  }

  export type EventRequirementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventRequirementCreateManyInput = {
    id?: string
    eventId: string
    label: string
    createdAt?: Date | string
  }

  export type EventRequirementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventRequirementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventApplicationCreateInput = {
    id?: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    event: EventCreateNestedOneWithoutApplicationsInput
    user: ProfileCreateNestedOneWithoutEventApplicationsInput
    reviewer?: ProfileCreateNestedOneWithoutReviewedApplicationsInput
  }

  export type EventApplicationUncheckedCreateInput = {
    id?: string
    eventId: string
    userId: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type EventApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    event?: EventUpdateOneRequiredWithoutApplicationsNestedInput
    user?: ProfileUpdateOneRequiredWithoutEventApplicationsNestedInput
    reviewer?: ProfileUpdateOneWithoutReviewedApplicationsNestedInput
  }

  export type EventApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventApplicationCreateManyInput = {
    id?: string
    eventId: string
    userId: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type EventApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EventApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    description: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    event?: EventCreateNestedOneWithoutTasksInput
    assignee: ProfileCreateNestedOneWithoutTasksAssignedInput
    assigner: ProfileCreateNestedOneWithoutTasksCreatedInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    eventId?: string | null
    assignedTo: string
    assignedBy: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneWithoutTasksNestedInput
    assignee?: ProfileUpdateOneRequiredWithoutTasksAssignedNestedInput
    assigner?: ProfileUpdateOneRequiredWithoutTasksCreatedNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: StringFieldUpdateOperationsInput | string
    assignedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateManyInput = {
    id?: string
    title: string
    description: string
    eventId?: string | null
    assignedTo: string
    assignedBy: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: StringFieldUpdateOperationsInput | string
    assignedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletBalanceCreateInput = {
    totalEarned?: number
    totalRedeemed?: number
    currentBalance?: number
    user: ProfileCreateNestedOneWithoutWalletBalanceInput
  }

  export type WalletBalanceUncheckedCreateInput = {
    userId: string
    totalEarned?: number
    totalRedeemed?: number
    currentBalance?: number
  }

  export type WalletBalanceUpdateInput = {
    totalEarned?: IntFieldUpdateOperationsInput | number
    totalRedeemed?: IntFieldUpdateOperationsInput | number
    currentBalance?: IntFieldUpdateOperationsInput | number
    user?: ProfileUpdateOneRequiredWithoutWalletBalanceNestedInput
  }

  export type WalletBalanceUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    totalEarned?: IntFieldUpdateOperationsInput | number
    totalRedeemed?: IntFieldUpdateOperationsInput | number
    currentBalance?: IntFieldUpdateOperationsInput | number
  }

  export type WalletBalanceCreateManyInput = {
    userId: string
    totalEarned?: number
    totalRedeemed?: number
    currentBalance?: number
  }

  export type WalletBalanceUpdateManyMutationInput = {
    totalEarned?: IntFieldUpdateOperationsInput | number
    totalRedeemed?: IntFieldUpdateOperationsInput | number
    currentBalance?: IntFieldUpdateOperationsInput | number
  }

  export type WalletBalanceUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    totalEarned?: IntFieldUpdateOperationsInput | number
    totalRedeemed?: IntFieldUpdateOperationsInput | number
    currentBalance?: IntFieldUpdateOperationsInput | number
  }

  export type CoinTransactionCreateInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    description: string
    referenceId?: string | null
    referenceType?: string | null
    createdAt?: Date | string
    user: ProfileCreateNestedOneWithoutCoinTransactionsInput
  }

  export type CoinTransactionUncheckedCreateInput = {
    id?: string
    userId: string
    type: $Enums.TransactionType
    amount: number
    description: string
    referenceId?: string | null
    referenceType?: string | null
    createdAt?: Date | string
  }

  export type CoinTransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    referenceType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ProfileUpdateOneRequiredWithoutCoinTransactionsNestedInput
  }

  export type CoinTransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    referenceType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CoinTransactionCreateManyInput = {
    id?: string
    userId: string
    type: $Enums.TransactionType
    amount: number
    description: string
    referenceId?: string | null
    referenceType?: string | null
    createdAt?: Date | string
  }

  export type CoinTransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    referenceType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CoinTransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    referenceType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbassadorCreateInput = {
    id?: string
    referralCode: string
    referralCount?: number
    totalCoinsEarned?: number
    tier?: $Enums.AmbassadorTier
    isActive?: boolean
    createdAt?: Date | string
    user: ProfileCreateNestedOneWithoutAmbassadorInput
    students?: StudentCreateNestedManyWithoutReferrerInput
  }

  export type AmbassadorUncheckedCreateInput = {
    id?: string
    userId: string
    referralCode: string
    referralCount?: number
    totalCoinsEarned?: number
    tier?: $Enums.AmbassadorTier
    isActive?: boolean
    createdAt?: Date | string
    students?: StudentUncheckedCreateNestedManyWithoutReferrerInput
  }

  export type AmbassadorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    referralCode?: StringFieldUpdateOperationsInput | string
    referralCount?: IntFieldUpdateOperationsInput | number
    totalCoinsEarned?: IntFieldUpdateOperationsInput | number
    tier?: EnumAmbassadorTierFieldUpdateOperationsInput | $Enums.AmbassadorTier
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ProfileUpdateOneRequiredWithoutAmbassadorNestedInput
    students?: StudentUpdateManyWithoutReferrerNestedInput
  }

  export type AmbassadorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    referralCode?: StringFieldUpdateOperationsInput | string
    referralCount?: IntFieldUpdateOperationsInput | number
    totalCoinsEarned?: IntFieldUpdateOperationsInput | number
    tier?: EnumAmbassadorTierFieldUpdateOperationsInput | $Enums.AmbassadorTier
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUncheckedUpdateManyWithoutReferrerNestedInput
  }

  export type AmbassadorCreateManyInput = {
    id?: string
    userId: string
    referralCode: string
    referralCount?: number
    totalCoinsEarned?: number
    tier?: $Enums.AmbassadorTier
    isActive?: boolean
    createdAt?: Date | string
  }

  export type AmbassadorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    referralCode?: StringFieldUpdateOperationsInput | string
    referralCount?: IntFieldUpdateOperationsInput | number
    totalCoinsEarned?: IntFieldUpdateOperationsInput | number
    tier?: EnumAmbassadorTierFieldUpdateOperationsInput | $Enums.AmbassadorTier
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmbassadorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    referralCode?: StringFieldUpdateOperationsInput | string
    referralCount?: IntFieldUpdateOperationsInput | number
    totalCoinsEarned?: IntFieldUpdateOperationsInput | number
    tier?: EnumAmbassadorTierFieldUpdateOperationsInput | $Enums.AmbassadorTier
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCreateInput = {
    id?: string
    college?: string | null
    course?: string | null
    yearOfStudy?: number | null
    ambassadorCode?: string | null
    createdAt?: Date | string
    user: ProfileCreateNestedOneWithoutStudentInput
    referrer?: AmbassadorCreateNestedOneWithoutStudentsInput
  }

  export type StudentUncheckedCreateInput = {
    id?: string
    userId: string
    college?: string | null
    course?: string | null
    yearOfStudy?: number | null
    ambassadorCode?: string | null
    referredBy?: string | null
    createdAt?: Date | string
  }

  export type StudentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    college?: NullableStringFieldUpdateOperationsInput | string | null
    course?: NullableStringFieldUpdateOperationsInput | string | null
    yearOfStudy?: NullableIntFieldUpdateOperationsInput | number | null
    ambassadorCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ProfileUpdateOneRequiredWithoutStudentNestedInput
    referrer?: AmbassadorUpdateOneWithoutStudentsNestedInput
  }

  export type StudentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    college?: NullableStringFieldUpdateOperationsInput | string | null
    course?: NullableStringFieldUpdateOperationsInput | string | null
    yearOfStudy?: NullableIntFieldUpdateOperationsInput | number | null
    ambassadorCode?: NullableStringFieldUpdateOperationsInput | string | null
    referredBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCreateManyInput = {
    id?: string
    userId: string
    college?: string | null
    course?: string | null
    yearOfStudy?: number | null
    ambassadorCode?: string | null
    referredBy?: string | null
    createdAt?: Date | string
  }

  export type StudentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    college?: NullableStringFieldUpdateOperationsInput | string | null
    course?: NullableStringFieldUpdateOperationsInput | string | null
    yearOfStudy?: NullableIntFieldUpdateOperationsInput | number | null
    ambassadorCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    college?: NullableStringFieldUpdateOperationsInput | string | null
    course?: NullableStringFieldUpdateOperationsInput | string | null
    yearOfStudy?: NullableIntFieldUpdateOperationsInput | number | null
    ambassadorCode?: NullableStringFieldUpdateOperationsInput | string | null
    referredBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    body: string
    type: string
    referenceId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    user: ProfileCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    body: string
    type: string
    referenceId?: string | null
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ProfileUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    title: string
    body: string
    type: string
    referenceId?: string | null
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CompanyListRelationFilter = {
    every?: CompanyWhereInput
    some?: CompanyWhereInput
    none?: CompanyWhereInput
  }

  export type EventListRelationFilter = {
    every?: EventWhereInput
    some?: EventWhereInput
    none?: EventWhereInput
  }

  export type EventApplicationListRelationFilter = {
    every?: EventApplicationWhereInput
    some?: EventApplicationWhereInput
    none?: EventApplicationWhereInput
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type CoinTransactionListRelationFilter = {
    every?: CoinTransactionWhereInput
    some?: CoinTransactionWhereInput
    none?: CoinTransactionWhereInput
  }

  export type WalletBalanceNullableRelationFilter = {
    is?: WalletBalanceWhereInput | null
    isNot?: WalletBalanceWhereInput | null
  }

  export type AmbassadorNullableRelationFilter = {
    is?: AmbassadorWhereInput | null
    isNot?: AmbassadorWhereInput | null
  }

  export type StudentNullableRelationFilter = {
    is?: StudentWhereInput | null
    isNot?: StudentWhereInput | null
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CompanyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CoinTransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    avatarUrl?: SortOrder
    role?: SortOrder
    phone?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    avatarUrl?: SortOrder
    role?: SortOrder
    phone?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    avatarUrl?: SortOrder
    role?: SortOrder
    phone?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ProfileRelationFilter = {
    is?: ProfileWhereInput
    isNot?: ProfileWhereInput
  }

  export type CompanyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    logoUrl?: SortOrder
    website?: SortOrder
    industry?: SortOrder
    description?: SortOrder
    contactPersonId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    logoUrl?: SortOrder
    website?: SortOrder
    industry?: SortOrder
    description?: SortOrder
    contactPersonId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    logoUrl?: SortOrder
    website?: SortOrder
    industry?: SortOrder
    description?: SortOrder
    contactPersonId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumEventStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | EnumEventStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEventStatusFilter<$PrismaModel> | $Enums.EventStatus
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type CompanyRelationFilter = {
    is?: CompanyWhereInput
    isNot?: CompanyWhereInput
  }

  export type ProfileNullableRelationFilter = {
    is?: ProfileWhereInput | null
    isNot?: ProfileWhereInput | null
  }

  export type EventRequirementListRelationFilter = {
    every?: EventRequirementWhereInput
    some?: EventRequirementWhereInput
    none?: EventRequirementWhereInput
  }

  export type EventRequirementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    companyId?: SortOrder
    eventDate?: SortOrder
    eventTime?: SortOrder
    location?: SortOrder
    locationUrl?: SortOrder
    category?: SortOrder
    bannerUrl?: SortOrder
    maxAttendees?: SortOrder
    currentAttendees?: SortOrder
    status?: SortOrder
    requirements?: SortOrder
    coinReward?: SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    maxAttendees?: SortOrder
    currentAttendees?: SortOrder
    coinReward?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    companyId?: SortOrder
    eventDate?: SortOrder
    eventTime?: SortOrder
    location?: SortOrder
    locationUrl?: SortOrder
    category?: SortOrder
    bannerUrl?: SortOrder
    maxAttendees?: SortOrder
    currentAttendees?: SortOrder
    status?: SortOrder
    requirements?: SortOrder
    coinReward?: SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    companyId?: SortOrder
    eventDate?: SortOrder
    eventTime?: SortOrder
    location?: SortOrder
    locationUrl?: SortOrder
    category?: SortOrder
    bannerUrl?: SortOrder
    maxAttendees?: SortOrder
    currentAttendees?: SortOrder
    status?: SortOrder
    requirements?: SortOrder
    coinReward?: SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    maxAttendees?: SortOrder
    currentAttendees?: SortOrder
    coinReward?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumEventStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | EnumEventStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEventStatusWithAggregatesFilter<$PrismaModel> | $Enums.EventStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEventStatusFilter<$PrismaModel>
    _max?: NestedEnumEventStatusFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EventRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type EventRequirementCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
  }

  export type EventRequirementMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
  }

  export type EventRequirementMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type EventApplicationEventIdUserIdCompoundUniqueInput = {
    eventId: string
    userId: string
  }

  export type EventApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    note?: SortOrder
    appliedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type EventApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    note?: SortOrder
    appliedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type EventApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    note?: SortOrder
    appliedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type EnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type EnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type EventNullableRelationFilter = {
    is?: EventWhereInput | null
    isNot?: EventWhereInput | null
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventId?: SortOrder
    assignedTo?: SortOrder
    assignedBy?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    coinValue?: SortOrder
    submissionUrl?: SortOrder
    submissionNote?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskAvgOrderByAggregateInput = {
    coinValue?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventId?: SortOrder
    assignedTo?: SortOrder
    assignedBy?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    coinValue?: SortOrder
    submissionUrl?: SortOrder
    submissionNote?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    eventId?: SortOrder
    assignedTo?: SortOrder
    assignedBy?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    coinValue?: SortOrder
    submissionUrl?: SortOrder
    submissionNote?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskSumOrderByAggregateInput = {
    coinValue?: SortOrder
  }

  export type EnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type WalletBalanceCountOrderByAggregateInput = {
    userId?: SortOrder
    totalEarned?: SortOrder
    totalRedeemed?: SortOrder
    currentBalance?: SortOrder
  }

  export type WalletBalanceAvgOrderByAggregateInput = {
    totalEarned?: SortOrder
    totalRedeemed?: SortOrder
    currentBalance?: SortOrder
  }

  export type WalletBalanceMaxOrderByAggregateInput = {
    userId?: SortOrder
    totalEarned?: SortOrder
    totalRedeemed?: SortOrder
    currentBalance?: SortOrder
  }

  export type WalletBalanceMinOrderByAggregateInput = {
    userId?: SortOrder
    totalEarned?: SortOrder
    totalRedeemed?: SortOrder
    currentBalance?: SortOrder
  }

  export type WalletBalanceSumOrderByAggregateInput = {
    totalEarned?: SortOrder
    totalRedeemed?: SortOrder
    currentBalance?: SortOrder
  }

  export type EnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type CoinTransactionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    referenceId?: SortOrder
    referenceType?: SortOrder
    createdAt?: SortOrder
  }

  export type CoinTransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type CoinTransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    referenceId?: SortOrder
    referenceType?: SortOrder
    createdAt?: SortOrder
  }

  export type CoinTransactionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    referenceId?: SortOrder
    referenceType?: SortOrder
    createdAt?: SortOrder
  }

  export type CoinTransactionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type EnumAmbassadorTierFilter<$PrismaModel = never> = {
    equals?: $Enums.AmbassadorTier | EnumAmbassadorTierFieldRefInput<$PrismaModel>
    in?: $Enums.AmbassadorTier[] | ListEnumAmbassadorTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.AmbassadorTier[] | ListEnumAmbassadorTierFieldRefInput<$PrismaModel>
    not?: NestedEnumAmbassadorTierFilter<$PrismaModel> | $Enums.AmbassadorTier
  }

  export type StudentListRelationFilter = {
    every?: StudentWhereInput
    some?: StudentWhereInput
    none?: StudentWhereInput
  }

  export type StudentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AmbassadorCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    referralCode?: SortOrder
    referralCount?: SortOrder
    totalCoinsEarned?: SortOrder
    tier?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type AmbassadorAvgOrderByAggregateInput = {
    referralCount?: SortOrder
    totalCoinsEarned?: SortOrder
  }

  export type AmbassadorMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    referralCode?: SortOrder
    referralCount?: SortOrder
    totalCoinsEarned?: SortOrder
    tier?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type AmbassadorMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    referralCode?: SortOrder
    referralCount?: SortOrder
    totalCoinsEarned?: SortOrder
    tier?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type AmbassadorSumOrderByAggregateInput = {
    referralCount?: SortOrder
    totalCoinsEarned?: SortOrder
  }

  export type EnumAmbassadorTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AmbassadorTier | EnumAmbassadorTierFieldRefInput<$PrismaModel>
    in?: $Enums.AmbassadorTier[] | ListEnumAmbassadorTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.AmbassadorTier[] | ListEnumAmbassadorTierFieldRefInput<$PrismaModel>
    not?: NestedEnumAmbassadorTierWithAggregatesFilter<$PrismaModel> | $Enums.AmbassadorTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAmbassadorTierFilter<$PrismaModel>
    _max?: NestedEnumAmbassadorTierFilter<$PrismaModel>
  }

  export type StudentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    college?: SortOrder
    course?: SortOrder
    yearOfStudy?: SortOrder
    ambassadorCode?: SortOrder
    referredBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentAvgOrderByAggregateInput = {
    yearOfStudy?: SortOrder
  }

  export type StudentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    college?: SortOrder
    course?: SortOrder
    yearOfStudy?: SortOrder
    ambassadorCode?: SortOrder
    referredBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    college?: SortOrder
    course?: SortOrder
    yearOfStudy?: SortOrder
    ambassadorCode?: SortOrder
    referredBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentSumOrderByAggregateInput = {
    yearOfStudy?: SortOrder
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    referenceId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    referenceId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    referenceId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type CompanyCreateNestedManyWithoutContactPersonInput = {
    create?: XOR<CompanyCreateWithoutContactPersonInput, CompanyUncheckedCreateWithoutContactPersonInput> | CompanyCreateWithoutContactPersonInput[] | CompanyUncheckedCreateWithoutContactPersonInput[]
    connectOrCreate?: CompanyCreateOrConnectWithoutContactPersonInput | CompanyCreateOrConnectWithoutContactPersonInput[]
    createMany?: CompanyCreateManyContactPersonInputEnvelope
    connect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
  }

  export type EventCreateNestedManyWithoutCreatorInput = {
    create?: XOR<EventCreateWithoutCreatorInput, EventUncheckedCreateWithoutCreatorInput> | EventCreateWithoutCreatorInput[] | EventUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCreatorInput | EventCreateOrConnectWithoutCreatorInput[]
    createMany?: EventCreateManyCreatorInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type EventCreateNestedManyWithoutApproverInput = {
    create?: XOR<EventCreateWithoutApproverInput, EventUncheckedCreateWithoutApproverInput> | EventCreateWithoutApproverInput[] | EventUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: EventCreateOrConnectWithoutApproverInput | EventCreateOrConnectWithoutApproverInput[]
    createMany?: EventCreateManyApproverInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type EventApplicationCreateNestedManyWithoutUserInput = {
    create?: XOR<EventApplicationCreateWithoutUserInput, EventApplicationUncheckedCreateWithoutUserInput> | EventApplicationCreateWithoutUserInput[] | EventApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutUserInput | EventApplicationCreateOrConnectWithoutUserInput[]
    createMany?: EventApplicationCreateManyUserInputEnvelope
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
  }

  export type EventApplicationCreateNestedManyWithoutReviewerInput = {
    create?: XOR<EventApplicationCreateWithoutReviewerInput, EventApplicationUncheckedCreateWithoutReviewerInput> | EventApplicationCreateWithoutReviewerInput[] | EventApplicationUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutReviewerInput | EventApplicationCreateOrConnectWithoutReviewerInput[]
    createMany?: EventApplicationCreateManyReviewerInputEnvelope
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutAssigneeInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutAssignerInput = {
    create?: XOR<TaskCreateWithoutAssignerInput, TaskUncheckedCreateWithoutAssignerInput> | TaskCreateWithoutAssignerInput[] | TaskUncheckedCreateWithoutAssignerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssignerInput | TaskCreateOrConnectWithoutAssignerInput[]
    createMany?: TaskCreateManyAssignerInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type CoinTransactionCreateNestedManyWithoutUserInput = {
    create?: XOR<CoinTransactionCreateWithoutUserInput, CoinTransactionUncheckedCreateWithoutUserInput> | CoinTransactionCreateWithoutUserInput[] | CoinTransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CoinTransactionCreateOrConnectWithoutUserInput | CoinTransactionCreateOrConnectWithoutUserInput[]
    createMany?: CoinTransactionCreateManyUserInputEnvelope
    connect?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
  }

  export type WalletBalanceCreateNestedOneWithoutUserInput = {
    create?: XOR<WalletBalanceCreateWithoutUserInput, WalletBalanceUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutUserInput
    connect?: WalletBalanceWhereUniqueInput
  }

  export type AmbassadorCreateNestedOneWithoutUserInput = {
    create?: XOR<AmbassadorCreateWithoutUserInput, AmbassadorUncheckedCreateWithoutUserInput>
    connectOrCreate?: AmbassadorCreateOrConnectWithoutUserInput
    connect?: AmbassadorWhereUniqueInput
  }

  export type StudentCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    connect?: StudentWhereUniqueInput
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type CompanyUncheckedCreateNestedManyWithoutContactPersonInput = {
    create?: XOR<CompanyCreateWithoutContactPersonInput, CompanyUncheckedCreateWithoutContactPersonInput> | CompanyCreateWithoutContactPersonInput[] | CompanyUncheckedCreateWithoutContactPersonInput[]
    connectOrCreate?: CompanyCreateOrConnectWithoutContactPersonInput | CompanyCreateOrConnectWithoutContactPersonInput[]
    createMany?: CompanyCreateManyContactPersonInputEnvelope
    connect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
  }

  export type EventUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<EventCreateWithoutCreatorInput, EventUncheckedCreateWithoutCreatorInput> | EventCreateWithoutCreatorInput[] | EventUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCreatorInput | EventCreateOrConnectWithoutCreatorInput[]
    createMany?: EventCreateManyCreatorInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type EventUncheckedCreateNestedManyWithoutApproverInput = {
    create?: XOR<EventCreateWithoutApproverInput, EventUncheckedCreateWithoutApproverInput> | EventCreateWithoutApproverInput[] | EventUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: EventCreateOrConnectWithoutApproverInput | EventCreateOrConnectWithoutApproverInput[]
    createMany?: EventCreateManyApproverInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type EventApplicationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EventApplicationCreateWithoutUserInput, EventApplicationUncheckedCreateWithoutUserInput> | EventApplicationCreateWithoutUserInput[] | EventApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutUserInput | EventApplicationCreateOrConnectWithoutUserInput[]
    createMany?: EventApplicationCreateManyUserInputEnvelope
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
  }

  export type EventApplicationUncheckedCreateNestedManyWithoutReviewerInput = {
    create?: XOR<EventApplicationCreateWithoutReviewerInput, EventApplicationUncheckedCreateWithoutReviewerInput> | EventApplicationCreateWithoutReviewerInput[] | EventApplicationUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutReviewerInput | EventApplicationCreateOrConnectWithoutReviewerInput[]
    createMany?: EventApplicationCreateManyReviewerInputEnvelope
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutAssigneeInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutAssignerInput = {
    create?: XOR<TaskCreateWithoutAssignerInput, TaskUncheckedCreateWithoutAssignerInput> | TaskCreateWithoutAssignerInput[] | TaskUncheckedCreateWithoutAssignerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssignerInput | TaskCreateOrConnectWithoutAssignerInput[]
    createMany?: TaskCreateManyAssignerInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type CoinTransactionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CoinTransactionCreateWithoutUserInput, CoinTransactionUncheckedCreateWithoutUserInput> | CoinTransactionCreateWithoutUserInput[] | CoinTransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CoinTransactionCreateOrConnectWithoutUserInput | CoinTransactionCreateOrConnectWithoutUserInput[]
    createMany?: CoinTransactionCreateManyUserInputEnvelope
    connect?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
  }

  export type WalletBalanceUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<WalletBalanceCreateWithoutUserInput, WalletBalanceUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutUserInput
    connect?: WalletBalanceWhereUniqueInput
  }

  export type AmbassadorUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<AmbassadorCreateWithoutUserInput, AmbassadorUncheckedCreateWithoutUserInput>
    connectOrCreate?: AmbassadorCreateOrConnectWithoutUserInput
    connect?: AmbassadorWhereUniqueInput
  }

  export type StudentUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    connect?: StudentWhereUniqueInput
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CompanyUpdateManyWithoutContactPersonNestedInput = {
    create?: XOR<CompanyCreateWithoutContactPersonInput, CompanyUncheckedCreateWithoutContactPersonInput> | CompanyCreateWithoutContactPersonInput[] | CompanyUncheckedCreateWithoutContactPersonInput[]
    connectOrCreate?: CompanyCreateOrConnectWithoutContactPersonInput | CompanyCreateOrConnectWithoutContactPersonInput[]
    upsert?: CompanyUpsertWithWhereUniqueWithoutContactPersonInput | CompanyUpsertWithWhereUniqueWithoutContactPersonInput[]
    createMany?: CompanyCreateManyContactPersonInputEnvelope
    set?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    disconnect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    delete?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    connect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    update?: CompanyUpdateWithWhereUniqueWithoutContactPersonInput | CompanyUpdateWithWhereUniqueWithoutContactPersonInput[]
    updateMany?: CompanyUpdateManyWithWhereWithoutContactPersonInput | CompanyUpdateManyWithWhereWithoutContactPersonInput[]
    deleteMany?: CompanyScalarWhereInput | CompanyScalarWhereInput[]
  }

  export type EventUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<EventCreateWithoutCreatorInput, EventUncheckedCreateWithoutCreatorInput> | EventCreateWithoutCreatorInput[] | EventUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCreatorInput | EventCreateOrConnectWithoutCreatorInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutCreatorInput | EventUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: EventCreateManyCreatorInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutCreatorInput | EventUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: EventUpdateManyWithWhereWithoutCreatorInput | EventUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type EventUpdateManyWithoutApproverNestedInput = {
    create?: XOR<EventCreateWithoutApproverInput, EventUncheckedCreateWithoutApproverInput> | EventCreateWithoutApproverInput[] | EventUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: EventCreateOrConnectWithoutApproverInput | EventCreateOrConnectWithoutApproverInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutApproverInput | EventUpsertWithWhereUniqueWithoutApproverInput[]
    createMany?: EventCreateManyApproverInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutApproverInput | EventUpdateWithWhereUniqueWithoutApproverInput[]
    updateMany?: EventUpdateManyWithWhereWithoutApproverInput | EventUpdateManyWithWhereWithoutApproverInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type EventApplicationUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventApplicationCreateWithoutUserInput, EventApplicationUncheckedCreateWithoutUserInput> | EventApplicationCreateWithoutUserInput[] | EventApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutUserInput | EventApplicationCreateOrConnectWithoutUserInput[]
    upsert?: EventApplicationUpsertWithWhereUniqueWithoutUserInput | EventApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventApplicationCreateManyUserInputEnvelope
    set?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    disconnect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    delete?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    update?: EventApplicationUpdateWithWhereUniqueWithoutUserInput | EventApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventApplicationUpdateManyWithWhereWithoutUserInput | EventApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventApplicationScalarWhereInput | EventApplicationScalarWhereInput[]
  }

  export type EventApplicationUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<EventApplicationCreateWithoutReviewerInput, EventApplicationUncheckedCreateWithoutReviewerInput> | EventApplicationCreateWithoutReviewerInput[] | EventApplicationUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutReviewerInput | EventApplicationCreateOrConnectWithoutReviewerInput[]
    upsert?: EventApplicationUpsertWithWhereUniqueWithoutReviewerInput | EventApplicationUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: EventApplicationCreateManyReviewerInputEnvelope
    set?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    disconnect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    delete?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    update?: EventApplicationUpdateWithWhereUniqueWithoutReviewerInput | EventApplicationUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: EventApplicationUpdateManyWithWhereWithoutReviewerInput | EventApplicationUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: EventApplicationScalarWhereInput | EventApplicationScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutAssigneeNestedInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssigneeInput | TaskUpsertWithWhereUniqueWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssigneeInput | TaskUpdateWithWhereUniqueWithoutAssigneeInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssigneeInput | TaskUpdateManyWithWhereWithoutAssigneeInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutAssignerNestedInput = {
    create?: XOR<TaskCreateWithoutAssignerInput, TaskUncheckedCreateWithoutAssignerInput> | TaskCreateWithoutAssignerInput[] | TaskUncheckedCreateWithoutAssignerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssignerInput | TaskCreateOrConnectWithoutAssignerInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssignerInput | TaskUpsertWithWhereUniqueWithoutAssignerInput[]
    createMany?: TaskCreateManyAssignerInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssignerInput | TaskUpdateWithWhereUniqueWithoutAssignerInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssignerInput | TaskUpdateManyWithWhereWithoutAssignerInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type CoinTransactionUpdateManyWithoutUserNestedInput = {
    create?: XOR<CoinTransactionCreateWithoutUserInput, CoinTransactionUncheckedCreateWithoutUserInput> | CoinTransactionCreateWithoutUserInput[] | CoinTransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CoinTransactionCreateOrConnectWithoutUserInput | CoinTransactionCreateOrConnectWithoutUserInput[]
    upsert?: CoinTransactionUpsertWithWhereUniqueWithoutUserInput | CoinTransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CoinTransactionCreateManyUserInputEnvelope
    set?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
    disconnect?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
    delete?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
    connect?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
    update?: CoinTransactionUpdateWithWhereUniqueWithoutUserInput | CoinTransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CoinTransactionUpdateManyWithWhereWithoutUserInput | CoinTransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CoinTransactionScalarWhereInput | CoinTransactionScalarWhereInput[]
  }

  export type WalletBalanceUpdateOneWithoutUserNestedInput = {
    create?: XOR<WalletBalanceCreateWithoutUserInput, WalletBalanceUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutUserInput
    upsert?: WalletBalanceUpsertWithoutUserInput
    disconnect?: WalletBalanceWhereInput | boolean
    delete?: WalletBalanceWhereInput | boolean
    connect?: WalletBalanceWhereUniqueInput
    update?: XOR<XOR<WalletBalanceUpdateToOneWithWhereWithoutUserInput, WalletBalanceUpdateWithoutUserInput>, WalletBalanceUncheckedUpdateWithoutUserInput>
  }

  export type AmbassadorUpdateOneWithoutUserNestedInput = {
    create?: XOR<AmbassadorCreateWithoutUserInput, AmbassadorUncheckedCreateWithoutUserInput>
    connectOrCreate?: AmbassadorCreateOrConnectWithoutUserInput
    upsert?: AmbassadorUpsertWithoutUserInput
    disconnect?: AmbassadorWhereInput | boolean
    delete?: AmbassadorWhereInput | boolean
    connect?: AmbassadorWhereUniqueInput
    update?: XOR<XOR<AmbassadorUpdateToOneWithWhereWithoutUserInput, AmbassadorUpdateWithoutUserInput>, AmbassadorUncheckedUpdateWithoutUserInput>
  }

  export type StudentUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    upsert?: StudentUpsertWithoutUserInput
    disconnect?: StudentWhereInput | boolean
    delete?: StudentWhereInput | boolean
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutUserInput, StudentUpdateWithoutUserInput>, StudentUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type CompanyUncheckedUpdateManyWithoutContactPersonNestedInput = {
    create?: XOR<CompanyCreateWithoutContactPersonInput, CompanyUncheckedCreateWithoutContactPersonInput> | CompanyCreateWithoutContactPersonInput[] | CompanyUncheckedCreateWithoutContactPersonInput[]
    connectOrCreate?: CompanyCreateOrConnectWithoutContactPersonInput | CompanyCreateOrConnectWithoutContactPersonInput[]
    upsert?: CompanyUpsertWithWhereUniqueWithoutContactPersonInput | CompanyUpsertWithWhereUniqueWithoutContactPersonInput[]
    createMany?: CompanyCreateManyContactPersonInputEnvelope
    set?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    disconnect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    delete?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    connect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    update?: CompanyUpdateWithWhereUniqueWithoutContactPersonInput | CompanyUpdateWithWhereUniqueWithoutContactPersonInput[]
    updateMany?: CompanyUpdateManyWithWhereWithoutContactPersonInput | CompanyUpdateManyWithWhereWithoutContactPersonInput[]
    deleteMany?: CompanyScalarWhereInput | CompanyScalarWhereInput[]
  }

  export type EventUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<EventCreateWithoutCreatorInput, EventUncheckedCreateWithoutCreatorInput> | EventCreateWithoutCreatorInput[] | EventUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCreatorInput | EventCreateOrConnectWithoutCreatorInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutCreatorInput | EventUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: EventCreateManyCreatorInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutCreatorInput | EventUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: EventUpdateManyWithWhereWithoutCreatorInput | EventUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type EventUncheckedUpdateManyWithoutApproverNestedInput = {
    create?: XOR<EventCreateWithoutApproverInput, EventUncheckedCreateWithoutApproverInput> | EventCreateWithoutApproverInput[] | EventUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: EventCreateOrConnectWithoutApproverInput | EventCreateOrConnectWithoutApproverInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutApproverInput | EventUpsertWithWhereUniqueWithoutApproverInput[]
    createMany?: EventCreateManyApproverInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutApproverInput | EventUpdateWithWhereUniqueWithoutApproverInput[]
    updateMany?: EventUpdateManyWithWhereWithoutApproverInput | EventUpdateManyWithWhereWithoutApproverInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type EventApplicationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventApplicationCreateWithoutUserInput, EventApplicationUncheckedCreateWithoutUserInput> | EventApplicationCreateWithoutUserInput[] | EventApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutUserInput | EventApplicationCreateOrConnectWithoutUserInput[]
    upsert?: EventApplicationUpsertWithWhereUniqueWithoutUserInput | EventApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventApplicationCreateManyUserInputEnvelope
    set?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    disconnect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    delete?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    update?: EventApplicationUpdateWithWhereUniqueWithoutUserInput | EventApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventApplicationUpdateManyWithWhereWithoutUserInput | EventApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventApplicationScalarWhereInput | EventApplicationScalarWhereInput[]
  }

  export type EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<EventApplicationCreateWithoutReviewerInput, EventApplicationUncheckedCreateWithoutReviewerInput> | EventApplicationCreateWithoutReviewerInput[] | EventApplicationUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutReviewerInput | EventApplicationCreateOrConnectWithoutReviewerInput[]
    upsert?: EventApplicationUpsertWithWhereUniqueWithoutReviewerInput | EventApplicationUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: EventApplicationCreateManyReviewerInputEnvelope
    set?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    disconnect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    delete?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    update?: EventApplicationUpdateWithWhereUniqueWithoutReviewerInput | EventApplicationUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: EventApplicationUpdateManyWithWhereWithoutReviewerInput | EventApplicationUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: EventApplicationScalarWhereInput | EventApplicationScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutAssigneeNestedInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssigneeInput | TaskUpsertWithWhereUniqueWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssigneeInput | TaskUpdateWithWhereUniqueWithoutAssigneeInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssigneeInput | TaskUpdateManyWithWhereWithoutAssigneeInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutAssignerNestedInput = {
    create?: XOR<TaskCreateWithoutAssignerInput, TaskUncheckedCreateWithoutAssignerInput> | TaskCreateWithoutAssignerInput[] | TaskUncheckedCreateWithoutAssignerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssignerInput | TaskCreateOrConnectWithoutAssignerInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssignerInput | TaskUpsertWithWhereUniqueWithoutAssignerInput[]
    createMany?: TaskCreateManyAssignerInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssignerInput | TaskUpdateWithWhereUniqueWithoutAssignerInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssignerInput | TaskUpdateManyWithWhereWithoutAssignerInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type CoinTransactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CoinTransactionCreateWithoutUserInput, CoinTransactionUncheckedCreateWithoutUserInput> | CoinTransactionCreateWithoutUserInput[] | CoinTransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CoinTransactionCreateOrConnectWithoutUserInput | CoinTransactionCreateOrConnectWithoutUserInput[]
    upsert?: CoinTransactionUpsertWithWhereUniqueWithoutUserInput | CoinTransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CoinTransactionCreateManyUserInputEnvelope
    set?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
    disconnect?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
    delete?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
    connect?: CoinTransactionWhereUniqueInput | CoinTransactionWhereUniqueInput[]
    update?: CoinTransactionUpdateWithWhereUniqueWithoutUserInput | CoinTransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CoinTransactionUpdateManyWithWhereWithoutUserInput | CoinTransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CoinTransactionScalarWhereInput | CoinTransactionScalarWhereInput[]
  }

  export type WalletBalanceUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<WalletBalanceCreateWithoutUserInput, WalletBalanceUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletBalanceCreateOrConnectWithoutUserInput
    upsert?: WalletBalanceUpsertWithoutUserInput
    disconnect?: WalletBalanceWhereInput | boolean
    delete?: WalletBalanceWhereInput | boolean
    connect?: WalletBalanceWhereUniqueInput
    update?: XOR<XOR<WalletBalanceUpdateToOneWithWhereWithoutUserInput, WalletBalanceUpdateWithoutUserInput>, WalletBalanceUncheckedUpdateWithoutUserInput>
  }

  export type AmbassadorUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<AmbassadorCreateWithoutUserInput, AmbassadorUncheckedCreateWithoutUserInput>
    connectOrCreate?: AmbassadorCreateOrConnectWithoutUserInput
    upsert?: AmbassadorUpsertWithoutUserInput
    disconnect?: AmbassadorWhereInput | boolean
    delete?: AmbassadorWhereInput | boolean
    connect?: AmbassadorWhereUniqueInput
    update?: XOR<XOR<AmbassadorUpdateToOneWithWhereWithoutUserInput, AmbassadorUpdateWithoutUserInput>, AmbassadorUncheckedUpdateWithoutUserInput>
  }

  export type StudentUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    upsert?: StudentUpsertWithoutUserInput
    disconnect?: StudentWhereInput | boolean
    delete?: StudentWhereInput | boolean
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutUserInput, StudentUpdateWithoutUserInput>, StudentUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type ProfileCreateNestedOneWithoutCompaniesOwnedInput = {
    create?: XOR<ProfileCreateWithoutCompaniesOwnedInput, ProfileUncheckedCreateWithoutCompaniesOwnedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCompaniesOwnedInput
    connect?: ProfileWhereUniqueInput
  }

  export type EventCreateNestedManyWithoutCompanyInput = {
    create?: XOR<EventCreateWithoutCompanyInput, EventUncheckedCreateWithoutCompanyInput> | EventCreateWithoutCompanyInput[] | EventUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCompanyInput | EventCreateOrConnectWithoutCompanyInput[]
    createMany?: EventCreateManyCompanyInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type EventUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<EventCreateWithoutCompanyInput, EventUncheckedCreateWithoutCompanyInput> | EventCreateWithoutCompanyInput[] | EventUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCompanyInput | EventCreateOrConnectWithoutCompanyInput[]
    createMany?: EventCreateManyCompanyInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type ProfileUpdateOneRequiredWithoutCompaniesOwnedNestedInput = {
    create?: XOR<ProfileCreateWithoutCompaniesOwnedInput, ProfileUncheckedCreateWithoutCompaniesOwnedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCompaniesOwnedInput
    upsert?: ProfileUpsertWithoutCompaniesOwnedInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutCompaniesOwnedInput, ProfileUpdateWithoutCompaniesOwnedInput>, ProfileUncheckedUpdateWithoutCompaniesOwnedInput>
  }

  export type EventUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<EventCreateWithoutCompanyInput, EventUncheckedCreateWithoutCompanyInput> | EventCreateWithoutCompanyInput[] | EventUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCompanyInput | EventCreateOrConnectWithoutCompanyInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutCompanyInput | EventUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: EventCreateManyCompanyInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutCompanyInput | EventUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: EventUpdateManyWithWhereWithoutCompanyInput | EventUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type EventUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<EventCreateWithoutCompanyInput, EventUncheckedCreateWithoutCompanyInput> | EventCreateWithoutCompanyInput[] | EventUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCompanyInput | EventCreateOrConnectWithoutCompanyInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutCompanyInput | EventUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: EventCreateManyCompanyInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutCompanyInput | EventUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: EventUpdateManyWithWhereWithoutCompanyInput | EventUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutEventsInput = {
    create?: XOR<CompanyCreateWithoutEventsInput, CompanyUncheckedCreateWithoutEventsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutEventsInput
    connect?: CompanyWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutEventsCreatedInput = {
    create?: XOR<ProfileCreateWithoutEventsCreatedInput, ProfileUncheckedCreateWithoutEventsCreatedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEventsCreatedInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutEventsApprovedInput = {
    create?: XOR<ProfileCreateWithoutEventsApprovedInput, ProfileUncheckedCreateWithoutEventsApprovedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEventsApprovedInput
    connect?: ProfileWhereUniqueInput
  }

  export type EventRequirementCreateNestedManyWithoutEventInput = {
    create?: XOR<EventRequirementCreateWithoutEventInput, EventRequirementUncheckedCreateWithoutEventInput> | EventRequirementCreateWithoutEventInput[] | EventRequirementUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventRequirementCreateOrConnectWithoutEventInput | EventRequirementCreateOrConnectWithoutEventInput[]
    createMany?: EventRequirementCreateManyEventInputEnvelope
    connect?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
  }

  export type EventApplicationCreateNestedManyWithoutEventInput = {
    create?: XOR<EventApplicationCreateWithoutEventInput, EventApplicationUncheckedCreateWithoutEventInput> | EventApplicationCreateWithoutEventInput[] | EventApplicationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutEventInput | EventApplicationCreateOrConnectWithoutEventInput[]
    createMany?: EventApplicationCreateManyEventInputEnvelope
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutEventInput = {
    create?: XOR<TaskCreateWithoutEventInput, TaskUncheckedCreateWithoutEventInput> | TaskCreateWithoutEventInput[] | TaskUncheckedCreateWithoutEventInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutEventInput | TaskCreateOrConnectWithoutEventInput[]
    createMany?: TaskCreateManyEventInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type EventRequirementUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<EventRequirementCreateWithoutEventInput, EventRequirementUncheckedCreateWithoutEventInput> | EventRequirementCreateWithoutEventInput[] | EventRequirementUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventRequirementCreateOrConnectWithoutEventInput | EventRequirementCreateOrConnectWithoutEventInput[]
    createMany?: EventRequirementCreateManyEventInputEnvelope
    connect?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
  }

  export type EventApplicationUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<EventApplicationCreateWithoutEventInput, EventApplicationUncheckedCreateWithoutEventInput> | EventApplicationCreateWithoutEventInput[] | EventApplicationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutEventInput | EventApplicationCreateOrConnectWithoutEventInput[]
    createMany?: EventApplicationCreateManyEventInputEnvelope
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<TaskCreateWithoutEventInput, TaskUncheckedCreateWithoutEventInput> | TaskCreateWithoutEventInput[] | TaskUncheckedCreateWithoutEventInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutEventInput | TaskCreateOrConnectWithoutEventInput[]
    createMany?: TaskCreateManyEventInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumEventStatusFieldUpdateOperationsInput = {
    set?: $Enums.EventStatus
  }

  export type CompanyUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<CompanyCreateWithoutEventsInput, CompanyUncheckedCreateWithoutEventsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutEventsInput
    upsert?: CompanyUpsertWithoutEventsInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutEventsInput, CompanyUpdateWithoutEventsInput>, CompanyUncheckedUpdateWithoutEventsInput>
  }

  export type ProfileUpdateOneRequiredWithoutEventsCreatedNestedInput = {
    create?: XOR<ProfileCreateWithoutEventsCreatedInput, ProfileUncheckedCreateWithoutEventsCreatedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEventsCreatedInput
    upsert?: ProfileUpsertWithoutEventsCreatedInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutEventsCreatedInput, ProfileUpdateWithoutEventsCreatedInput>, ProfileUncheckedUpdateWithoutEventsCreatedInput>
  }

  export type ProfileUpdateOneWithoutEventsApprovedNestedInput = {
    create?: XOR<ProfileCreateWithoutEventsApprovedInput, ProfileUncheckedCreateWithoutEventsApprovedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEventsApprovedInput
    upsert?: ProfileUpsertWithoutEventsApprovedInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutEventsApprovedInput, ProfileUpdateWithoutEventsApprovedInput>, ProfileUncheckedUpdateWithoutEventsApprovedInput>
  }

  export type EventRequirementUpdateManyWithoutEventNestedInput = {
    create?: XOR<EventRequirementCreateWithoutEventInput, EventRequirementUncheckedCreateWithoutEventInput> | EventRequirementCreateWithoutEventInput[] | EventRequirementUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventRequirementCreateOrConnectWithoutEventInput | EventRequirementCreateOrConnectWithoutEventInput[]
    upsert?: EventRequirementUpsertWithWhereUniqueWithoutEventInput | EventRequirementUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventRequirementCreateManyEventInputEnvelope
    set?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
    disconnect?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
    delete?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
    connect?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
    update?: EventRequirementUpdateWithWhereUniqueWithoutEventInput | EventRequirementUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EventRequirementUpdateManyWithWhereWithoutEventInput | EventRequirementUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventRequirementScalarWhereInput | EventRequirementScalarWhereInput[]
  }

  export type EventApplicationUpdateManyWithoutEventNestedInput = {
    create?: XOR<EventApplicationCreateWithoutEventInput, EventApplicationUncheckedCreateWithoutEventInput> | EventApplicationCreateWithoutEventInput[] | EventApplicationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutEventInput | EventApplicationCreateOrConnectWithoutEventInput[]
    upsert?: EventApplicationUpsertWithWhereUniqueWithoutEventInput | EventApplicationUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventApplicationCreateManyEventInputEnvelope
    set?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    disconnect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    delete?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    update?: EventApplicationUpdateWithWhereUniqueWithoutEventInput | EventApplicationUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EventApplicationUpdateManyWithWhereWithoutEventInput | EventApplicationUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventApplicationScalarWhereInput | EventApplicationScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutEventNestedInput = {
    create?: XOR<TaskCreateWithoutEventInput, TaskUncheckedCreateWithoutEventInput> | TaskCreateWithoutEventInput[] | TaskUncheckedCreateWithoutEventInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutEventInput | TaskCreateOrConnectWithoutEventInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutEventInput | TaskUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: TaskCreateManyEventInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutEventInput | TaskUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutEventInput | TaskUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type EventRequirementUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<EventRequirementCreateWithoutEventInput, EventRequirementUncheckedCreateWithoutEventInput> | EventRequirementCreateWithoutEventInput[] | EventRequirementUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventRequirementCreateOrConnectWithoutEventInput | EventRequirementCreateOrConnectWithoutEventInput[]
    upsert?: EventRequirementUpsertWithWhereUniqueWithoutEventInput | EventRequirementUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventRequirementCreateManyEventInputEnvelope
    set?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
    disconnect?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
    delete?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
    connect?: EventRequirementWhereUniqueInput | EventRequirementWhereUniqueInput[]
    update?: EventRequirementUpdateWithWhereUniqueWithoutEventInput | EventRequirementUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EventRequirementUpdateManyWithWhereWithoutEventInput | EventRequirementUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventRequirementScalarWhereInput | EventRequirementScalarWhereInput[]
  }

  export type EventApplicationUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<EventApplicationCreateWithoutEventInput, EventApplicationUncheckedCreateWithoutEventInput> | EventApplicationCreateWithoutEventInput[] | EventApplicationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventApplicationCreateOrConnectWithoutEventInput | EventApplicationCreateOrConnectWithoutEventInput[]
    upsert?: EventApplicationUpsertWithWhereUniqueWithoutEventInput | EventApplicationUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventApplicationCreateManyEventInputEnvelope
    set?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    disconnect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    delete?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    connect?: EventApplicationWhereUniqueInput | EventApplicationWhereUniqueInput[]
    update?: EventApplicationUpdateWithWhereUniqueWithoutEventInput | EventApplicationUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EventApplicationUpdateManyWithWhereWithoutEventInput | EventApplicationUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventApplicationScalarWhereInput | EventApplicationScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<TaskCreateWithoutEventInput, TaskUncheckedCreateWithoutEventInput> | TaskCreateWithoutEventInput[] | TaskUncheckedCreateWithoutEventInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutEventInput | TaskCreateOrConnectWithoutEventInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutEventInput | TaskUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: TaskCreateManyEventInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutEventInput | TaskUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutEventInput | TaskUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type EventCreateNestedOneWithoutRequirements_listInput = {
    create?: XOR<EventCreateWithoutRequirements_listInput, EventUncheckedCreateWithoutRequirements_listInput>
    connectOrCreate?: EventCreateOrConnectWithoutRequirements_listInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutRequirements_listNestedInput = {
    create?: XOR<EventCreateWithoutRequirements_listInput, EventUncheckedCreateWithoutRequirements_listInput>
    connectOrCreate?: EventCreateOrConnectWithoutRequirements_listInput
    upsert?: EventUpsertWithoutRequirements_listInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutRequirements_listInput, EventUpdateWithoutRequirements_listInput>, EventUncheckedUpdateWithoutRequirements_listInput>
  }

  export type EventCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<EventCreateWithoutApplicationsInput, EventUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: EventCreateOrConnectWithoutApplicationsInput
    connect?: EventWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutEventApplicationsInput = {
    create?: XOR<ProfileCreateWithoutEventApplicationsInput, ProfileUncheckedCreateWithoutEventApplicationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEventApplicationsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutReviewedApplicationsInput = {
    create?: XOR<ProfileCreateWithoutReviewedApplicationsInput, ProfileUncheckedCreateWithoutReviewedApplicationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutReviewedApplicationsInput
    connect?: ProfileWhereUniqueInput
  }

  export type EnumApplicationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ApplicationStatus
  }

  export type EventUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<EventCreateWithoutApplicationsInput, EventUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: EventCreateOrConnectWithoutApplicationsInput
    upsert?: EventUpsertWithoutApplicationsInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutApplicationsInput, EventUpdateWithoutApplicationsInput>, EventUncheckedUpdateWithoutApplicationsInput>
  }

  export type ProfileUpdateOneRequiredWithoutEventApplicationsNestedInput = {
    create?: XOR<ProfileCreateWithoutEventApplicationsInput, ProfileUncheckedCreateWithoutEventApplicationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEventApplicationsInput
    upsert?: ProfileUpsertWithoutEventApplicationsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutEventApplicationsInput, ProfileUpdateWithoutEventApplicationsInput>, ProfileUncheckedUpdateWithoutEventApplicationsInput>
  }

  export type ProfileUpdateOneWithoutReviewedApplicationsNestedInput = {
    create?: XOR<ProfileCreateWithoutReviewedApplicationsInput, ProfileUncheckedCreateWithoutReviewedApplicationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutReviewedApplicationsInput
    upsert?: ProfileUpsertWithoutReviewedApplicationsInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutReviewedApplicationsInput, ProfileUpdateWithoutReviewedApplicationsInput>, ProfileUncheckedUpdateWithoutReviewedApplicationsInput>
  }

  export type EventCreateNestedOneWithoutTasksInput = {
    create?: XOR<EventCreateWithoutTasksInput, EventUncheckedCreateWithoutTasksInput>
    connectOrCreate?: EventCreateOrConnectWithoutTasksInput
    connect?: EventWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutTasksAssignedInput = {
    create?: XOR<ProfileCreateWithoutTasksAssignedInput, ProfileUncheckedCreateWithoutTasksAssignedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutTasksAssignedInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutTasksCreatedInput = {
    create?: XOR<ProfileCreateWithoutTasksCreatedInput, ProfileUncheckedCreateWithoutTasksCreatedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutTasksCreatedInput
    connect?: ProfileWhereUniqueInput
  }

  export type EnumTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskStatus
  }

  export type EventUpdateOneWithoutTasksNestedInput = {
    create?: XOR<EventCreateWithoutTasksInput, EventUncheckedCreateWithoutTasksInput>
    connectOrCreate?: EventCreateOrConnectWithoutTasksInput
    upsert?: EventUpsertWithoutTasksInput
    disconnect?: EventWhereInput | boolean
    delete?: EventWhereInput | boolean
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutTasksInput, EventUpdateWithoutTasksInput>, EventUncheckedUpdateWithoutTasksInput>
  }

  export type ProfileUpdateOneRequiredWithoutTasksAssignedNestedInput = {
    create?: XOR<ProfileCreateWithoutTasksAssignedInput, ProfileUncheckedCreateWithoutTasksAssignedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutTasksAssignedInput
    upsert?: ProfileUpsertWithoutTasksAssignedInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutTasksAssignedInput, ProfileUpdateWithoutTasksAssignedInput>, ProfileUncheckedUpdateWithoutTasksAssignedInput>
  }

  export type ProfileUpdateOneRequiredWithoutTasksCreatedNestedInput = {
    create?: XOR<ProfileCreateWithoutTasksCreatedInput, ProfileUncheckedCreateWithoutTasksCreatedInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutTasksCreatedInput
    upsert?: ProfileUpsertWithoutTasksCreatedInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutTasksCreatedInput, ProfileUpdateWithoutTasksCreatedInput>, ProfileUncheckedUpdateWithoutTasksCreatedInput>
  }

  export type ProfileCreateNestedOneWithoutWalletBalanceInput = {
    create?: XOR<ProfileCreateWithoutWalletBalanceInput, ProfileUncheckedCreateWithoutWalletBalanceInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutWalletBalanceInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutWalletBalanceNestedInput = {
    create?: XOR<ProfileCreateWithoutWalletBalanceInput, ProfileUncheckedCreateWithoutWalletBalanceInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutWalletBalanceInput
    upsert?: ProfileUpsertWithoutWalletBalanceInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutWalletBalanceInput, ProfileUpdateWithoutWalletBalanceInput>, ProfileUncheckedUpdateWithoutWalletBalanceInput>
  }

  export type ProfileCreateNestedOneWithoutCoinTransactionsInput = {
    create?: XOR<ProfileCreateWithoutCoinTransactionsInput, ProfileUncheckedCreateWithoutCoinTransactionsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCoinTransactionsInput
    connect?: ProfileWhereUniqueInput
  }

  export type EnumTransactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.TransactionType
  }

  export type ProfileUpdateOneRequiredWithoutCoinTransactionsNestedInput = {
    create?: XOR<ProfileCreateWithoutCoinTransactionsInput, ProfileUncheckedCreateWithoutCoinTransactionsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCoinTransactionsInput
    upsert?: ProfileUpsertWithoutCoinTransactionsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutCoinTransactionsInput, ProfileUpdateWithoutCoinTransactionsInput>, ProfileUncheckedUpdateWithoutCoinTransactionsInput>
  }

  export type ProfileCreateNestedOneWithoutAmbassadorInput = {
    create?: XOR<ProfileCreateWithoutAmbassadorInput, ProfileUncheckedCreateWithoutAmbassadorInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAmbassadorInput
    connect?: ProfileWhereUniqueInput
  }

  export type StudentCreateNestedManyWithoutReferrerInput = {
    create?: XOR<StudentCreateWithoutReferrerInput, StudentUncheckedCreateWithoutReferrerInput> | StudentCreateWithoutReferrerInput[] | StudentUncheckedCreateWithoutReferrerInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutReferrerInput | StudentCreateOrConnectWithoutReferrerInput[]
    createMany?: StudentCreateManyReferrerInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type StudentUncheckedCreateNestedManyWithoutReferrerInput = {
    create?: XOR<StudentCreateWithoutReferrerInput, StudentUncheckedCreateWithoutReferrerInput> | StudentCreateWithoutReferrerInput[] | StudentUncheckedCreateWithoutReferrerInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutReferrerInput | StudentCreateOrConnectWithoutReferrerInput[]
    createMany?: StudentCreateManyReferrerInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type EnumAmbassadorTierFieldUpdateOperationsInput = {
    set?: $Enums.AmbassadorTier
  }

  export type ProfileUpdateOneRequiredWithoutAmbassadorNestedInput = {
    create?: XOR<ProfileCreateWithoutAmbassadorInput, ProfileUncheckedCreateWithoutAmbassadorInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAmbassadorInput
    upsert?: ProfileUpsertWithoutAmbassadorInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutAmbassadorInput, ProfileUpdateWithoutAmbassadorInput>, ProfileUncheckedUpdateWithoutAmbassadorInput>
  }

  export type StudentUpdateManyWithoutReferrerNestedInput = {
    create?: XOR<StudentCreateWithoutReferrerInput, StudentUncheckedCreateWithoutReferrerInput> | StudentCreateWithoutReferrerInput[] | StudentUncheckedCreateWithoutReferrerInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutReferrerInput | StudentCreateOrConnectWithoutReferrerInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutReferrerInput | StudentUpsertWithWhereUniqueWithoutReferrerInput[]
    createMany?: StudentCreateManyReferrerInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutReferrerInput | StudentUpdateWithWhereUniqueWithoutReferrerInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutReferrerInput | StudentUpdateManyWithWhereWithoutReferrerInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type StudentUncheckedUpdateManyWithoutReferrerNestedInput = {
    create?: XOR<StudentCreateWithoutReferrerInput, StudentUncheckedCreateWithoutReferrerInput> | StudentCreateWithoutReferrerInput[] | StudentUncheckedCreateWithoutReferrerInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutReferrerInput | StudentCreateOrConnectWithoutReferrerInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutReferrerInput | StudentUpsertWithWhereUniqueWithoutReferrerInput[]
    createMany?: StudentCreateManyReferrerInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutReferrerInput | StudentUpdateWithWhereUniqueWithoutReferrerInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutReferrerInput | StudentUpdateManyWithWhereWithoutReferrerInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type ProfileCreateNestedOneWithoutStudentInput = {
    create?: XOR<ProfileCreateWithoutStudentInput, ProfileUncheckedCreateWithoutStudentInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutStudentInput
    connect?: ProfileWhereUniqueInput
  }

  export type AmbassadorCreateNestedOneWithoutStudentsInput = {
    create?: XOR<AmbassadorCreateWithoutStudentsInput, AmbassadorUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: AmbassadorCreateOrConnectWithoutStudentsInput
    connect?: AmbassadorWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutStudentNestedInput = {
    create?: XOR<ProfileCreateWithoutStudentInput, ProfileUncheckedCreateWithoutStudentInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutStudentInput
    upsert?: ProfileUpsertWithoutStudentInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutStudentInput, ProfileUpdateWithoutStudentInput>, ProfileUncheckedUpdateWithoutStudentInput>
  }

  export type AmbassadorUpdateOneWithoutStudentsNestedInput = {
    create?: XOR<AmbassadorCreateWithoutStudentsInput, AmbassadorUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: AmbassadorCreateOrConnectWithoutStudentsInput
    upsert?: AmbassadorUpsertWithoutStudentsInput
    disconnect?: AmbassadorWhereInput | boolean
    delete?: AmbassadorWhereInput | boolean
    connect?: AmbassadorWhereUniqueInput
    update?: XOR<XOR<AmbassadorUpdateToOneWithWhereWithoutStudentsInput, AmbassadorUpdateWithoutStudentsInput>, AmbassadorUncheckedUpdateWithoutStudentsInput>
  }

  export type ProfileCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<ProfileCreateWithoutNotificationsInput, ProfileUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutNotificationsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<ProfileCreateWithoutNotificationsInput, ProfileUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutNotificationsInput
    upsert?: ProfileUpsertWithoutNotificationsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutNotificationsInput, ProfileUpdateWithoutNotificationsInput>, ProfileUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumEventStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | EnumEventStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEventStatusFilter<$PrismaModel> | $Enums.EventStatus
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumEventStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | EnumEventStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEventStatusWithAggregatesFilter<$PrismaModel> | $Enums.EventStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEventStatusFilter<$PrismaModel>
    _max?: NestedEnumEventStatusFilter<$PrismaModel>
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type NestedEnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type NestedEnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type NestedEnumAmbassadorTierFilter<$PrismaModel = never> = {
    equals?: $Enums.AmbassadorTier | EnumAmbassadorTierFieldRefInput<$PrismaModel>
    in?: $Enums.AmbassadorTier[] | ListEnumAmbassadorTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.AmbassadorTier[] | ListEnumAmbassadorTierFieldRefInput<$PrismaModel>
    not?: NestedEnumAmbassadorTierFilter<$PrismaModel> | $Enums.AmbassadorTier
  }

  export type NestedEnumAmbassadorTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AmbassadorTier | EnumAmbassadorTierFieldRefInput<$PrismaModel>
    in?: $Enums.AmbassadorTier[] | ListEnumAmbassadorTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.AmbassadorTier[] | ListEnumAmbassadorTierFieldRefInput<$PrismaModel>
    not?: NestedEnumAmbassadorTierWithAggregatesFilter<$PrismaModel> | $Enums.AmbassadorTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAmbassadorTierFilter<$PrismaModel>
    _max?: NestedEnumAmbassadorTierFilter<$PrismaModel>
  }

  export type CompanyCreateWithoutContactPersonInput = {
    id?: string
    name: string
    logoUrl?: string | null
    website?: string | null
    industry?: string | null
    description?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutContactPersonInput = {
    id?: string
    name: string
    logoUrl?: string | null
    website?: string | null
    industry?: string | null
    description?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutContactPersonInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutContactPersonInput, CompanyUncheckedCreateWithoutContactPersonInput>
  }

  export type CompanyCreateManyContactPersonInputEnvelope = {
    data: CompanyCreateManyContactPersonInput | CompanyCreateManyContactPersonInput[]
    skipDuplicates?: boolean
  }

  export type EventCreateWithoutCreatorInput = {
    id?: string
    title: string
    description: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutEventsInput
    approver?: ProfileCreateNestedOneWithoutEventsApprovedInput
    requirements_list?: EventRequirementCreateNestedManyWithoutEventInput
    applications?: EventApplicationCreateNestedManyWithoutEventInput
    tasks?: TaskCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutCreatorInput = {
    id?: string
    title: string
    description: string
    companyId: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements_list?: EventRequirementUncheckedCreateNestedManyWithoutEventInput
    applications?: EventApplicationUncheckedCreateNestedManyWithoutEventInput
    tasks?: TaskUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutCreatorInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutCreatorInput, EventUncheckedCreateWithoutCreatorInput>
  }

  export type EventCreateManyCreatorInputEnvelope = {
    data: EventCreateManyCreatorInput | EventCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type EventCreateWithoutApproverInput = {
    id?: string
    title: string
    description: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutEventsInput
    creator: ProfileCreateNestedOneWithoutEventsCreatedInput
    requirements_list?: EventRequirementCreateNestedManyWithoutEventInput
    applications?: EventApplicationCreateNestedManyWithoutEventInput
    tasks?: TaskCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutApproverInput = {
    id?: string
    title: string
    description: string
    companyId: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    createdBy: string
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements_list?: EventRequirementUncheckedCreateNestedManyWithoutEventInput
    applications?: EventApplicationUncheckedCreateNestedManyWithoutEventInput
    tasks?: TaskUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutApproverInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutApproverInput, EventUncheckedCreateWithoutApproverInput>
  }

  export type EventCreateManyApproverInputEnvelope = {
    data: EventCreateManyApproverInput | EventCreateManyApproverInput[]
    skipDuplicates?: boolean
  }

  export type EventApplicationCreateWithoutUserInput = {
    id?: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    event: EventCreateNestedOneWithoutApplicationsInput
    reviewer?: ProfileCreateNestedOneWithoutReviewedApplicationsInput
  }

  export type EventApplicationUncheckedCreateWithoutUserInput = {
    id?: string
    eventId: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type EventApplicationCreateOrConnectWithoutUserInput = {
    where: EventApplicationWhereUniqueInput
    create: XOR<EventApplicationCreateWithoutUserInput, EventApplicationUncheckedCreateWithoutUserInput>
  }

  export type EventApplicationCreateManyUserInputEnvelope = {
    data: EventApplicationCreateManyUserInput | EventApplicationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EventApplicationCreateWithoutReviewerInput = {
    id?: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    event: EventCreateNestedOneWithoutApplicationsInput
    user: ProfileCreateNestedOneWithoutEventApplicationsInput
  }

  export type EventApplicationUncheckedCreateWithoutReviewerInput = {
    id?: string
    eventId: string
    userId: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type EventApplicationCreateOrConnectWithoutReviewerInput = {
    where: EventApplicationWhereUniqueInput
    create: XOR<EventApplicationCreateWithoutReviewerInput, EventApplicationUncheckedCreateWithoutReviewerInput>
  }

  export type EventApplicationCreateManyReviewerInputEnvelope = {
    data: EventApplicationCreateManyReviewerInput | EventApplicationCreateManyReviewerInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutAssigneeInput = {
    id?: string
    title: string
    description: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    event?: EventCreateNestedOneWithoutTasksInput
    assigner: ProfileCreateNestedOneWithoutTasksCreatedInput
  }

  export type TaskUncheckedCreateWithoutAssigneeInput = {
    id?: string
    title: string
    description: string
    eventId?: string | null
    assignedBy: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutAssigneeInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput>
  }

  export type TaskCreateManyAssigneeInputEnvelope = {
    data: TaskCreateManyAssigneeInput | TaskCreateManyAssigneeInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutAssignerInput = {
    id?: string
    title: string
    description: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    event?: EventCreateNestedOneWithoutTasksInput
    assignee: ProfileCreateNestedOneWithoutTasksAssignedInput
  }

  export type TaskUncheckedCreateWithoutAssignerInput = {
    id?: string
    title: string
    description: string
    eventId?: string | null
    assignedTo: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutAssignerInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutAssignerInput, TaskUncheckedCreateWithoutAssignerInput>
  }

  export type TaskCreateManyAssignerInputEnvelope = {
    data: TaskCreateManyAssignerInput | TaskCreateManyAssignerInput[]
    skipDuplicates?: boolean
  }

  export type CoinTransactionCreateWithoutUserInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    description: string
    referenceId?: string | null
    referenceType?: string | null
    createdAt?: Date | string
  }

  export type CoinTransactionUncheckedCreateWithoutUserInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    description: string
    referenceId?: string | null
    referenceType?: string | null
    createdAt?: Date | string
  }

  export type CoinTransactionCreateOrConnectWithoutUserInput = {
    where: CoinTransactionWhereUniqueInput
    create: XOR<CoinTransactionCreateWithoutUserInput, CoinTransactionUncheckedCreateWithoutUserInput>
  }

  export type CoinTransactionCreateManyUserInputEnvelope = {
    data: CoinTransactionCreateManyUserInput | CoinTransactionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WalletBalanceCreateWithoutUserInput = {
    totalEarned?: number
    totalRedeemed?: number
    currentBalance?: number
  }

  export type WalletBalanceUncheckedCreateWithoutUserInput = {
    totalEarned?: number
    totalRedeemed?: number
    currentBalance?: number
  }

  export type WalletBalanceCreateOrConnectWithoutUserInput = {
    where: WalletBalanceWhereUniqueInput
    create: XOR<WalletBalanceCreateWithoutUserInput, WalletBalanceUncheckedCreateWithoutUserInput>
  }

  export type AmbassadorCreateWithoutUserInput = {
    id?: string
    referralCode: string
    referralCount?: number
    totalCoinsEarned?: number
    tier?: $Enums.AmbassadorTier
    isActive?: boolean
    createdAt?: Date | string
    students?: StudentCreateNestedManyWithoutReferrerInput
  }

  export type AmbassadorUncheckedCreateWithoutUserInput = {
    id?: string
    referralCode: string
    referralCount?: number
    totalCoinsEarned?: number
    tier?: $Enums.AmbassadorTier
    isActive?: boolean
    createdAt?: Date | string
    students?: StudentUncheckedCreateNestedManyWithoutReferrerInput
  }

  export type AmbassadorCreateOrConnectWithoutUserInput = {
    where: AmbassadorWhereUniqueInput
    create: XOR<AmbassadorCreateWithoutUserInput, AmbassadorUncheckedCreateWithoutUserInput>
  }

  export type StudentCreateWithoutUserInput = {
    id?: string
    college?: string | null
    course?: string | null
    yearOfStudy?: number | null
    ambassadorCode?: string | null
    createdAt?: Date | string
    referrer?: AmbassadorCreateNestedOneWithoutStudentsInput
  }

  export type StudentUncheckedCreateWithoutUserInput = {
    id?: string
    college?: string | null
    course?: string | null
    yearOfStudy?: number | null
    ambassadorCode?: string | null
    referredBy?: string | null
    createdAt?: Date | string
  }

  export type StudentCreateOrConnectWithoutUserInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    title: string
    body: string
    type: string
    referenceId?: string | null
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    body: string
    type: string
    referenceId?: string | null
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithWhereUniqueWithoutContactPersonInput = {
    where: CompanyWhereUniqueInput
    update: XOR<CompanyUpdateWithoutContactPersonInput, CompanyUncheckedUpdateWithoutContactPersonInput>
    create: XOR<CompanyCreateWithoutContactPersonInput, CompanyUncheckedCreateWithoutContactPersonInput>
  }

  export type CompanyUpdateWithWhereUniqueWithoutContactPersonInput = {
    where: CompanyWhereUniqueInput
    data: XOR<CompanyUpdateWithoutContactPersonInput, CompanyUncheckedUpdateWithoutContactPersonInput>
  }

  export type CompanyUpdateManyWithWhereWithoutContactPersonInput = {
    where: CompanyScalarWhereInput
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyWithoutContactPersonInput>
  }

  export type CompanyScalarWhereInput = {
    AND?: CompanyScalarWhereInput | CompanyScalarWhereInput[]
    OR?: CompanyScalarWhereInput[]
    NOT?: CompanyScalarWhereInput | CompanyScalarWhereInput[]
    id?: UuidFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    logoUrl?: StringNullableFilter<"Company"> | string | null
    website?: StringNullableFilter<"Company"> | string | null
    industry?: StringNullableFilter<"Company"> | string | null
    description?: StringNullableFilter<"Company"> | string | null
    contactPersonId?: UuidFilter<"Company"> | string
    isVerified?: BoolFilter<"Company"> | boolean
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
  }

  export type EventUpsertWithWhereUniqueWithoutCreatorInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutCreatorInput, EventUncheckedUpdateWithoutCreatorInput>
    create: XOR<EventCreateWithoutCreatorInput, EventUncheckedCreateWithoutCreatorInput>
  }

  export type EventUpdateWithWhereUniqueWithoutCreatorInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutCreatorInput, EventUncheckedUpdateWithoutCreatorInput>
  }

  export type EventUpdateManyWithWhereWithoutCreatorInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutCreatorInput>
  }

  export type EventScalarWhereInput = {
    AND?: EventScalarWhereInput | EventScalarWhereInput[]
    OR?: EventScalarWhereInput[]
    NOT?: EventScalarWhereInput | EventScalarWhereInput[]
    id?: UuidFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    description?: StringFilter<"Event"> | string
    companyId?: UuidFilter<"Event"> | string
    eventDate?: DateTimeFilter<"Event"> | Date | string
    eventTime?: DateTimeNullableFilter<"Event"> | Date | string | null
    location?: StringFilter<"Event"> | string
    locationUrl?: StringNullableFilter<"Event"> | string | null
    category?: StringFilter<"Event"> | string
    bannerUrl?: StringNullableFilter<"Event"> | string | null
    maxAttendees?: IntNullableFilter<"Event"> | number | null
    currentAttendees?: IntFilter<"Event"> | number
    status?: EnumEventStatusFilter<"Event"> | $Enums.EventStatus
    requirements?: StringNullableFilter<"Event"> | string | null
    coinReward?: IntFilter<"Event"> | number
    createdBy?: UuidFilter<"Event"> | string
    approvedBy?: UuidNullableFilter<"Event"> | string | null
    approvedAt?: DateTimeNullableFilter<"Event"> | Date | string | null
    rejectionReason?: StringNullableFilter<"Event"> | string | null
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
  }

  export type EventUpsertWithWhereUniqueWithoutApproverInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutApproverInput, EventUncheckedUpdateWithoutApproverInput>
    create: XOR<EventCreateWithoutApproverInput, EventUncheckedCreateWithoutApproverInput>
  }

  export type EventUpdateWithWhereUniqueWithoutApproverInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutApproverInput, EventUncheckedUpdateWithoutApproverInput>
  }

  export type EventUpdateManyWithWhereWithoutApproverInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutApproverInput>
  }

  export type EventApplicationUpsertWithWhereUniqueWithoutUserInput = {
    where: EventApplicationWhereUniqueInput
    update: XOR<EventApplicationUpdateWithoutUserInput, EventApplicationUncheckedUpdateWithoutUserInput>
    create: XOR<EventApplicationCreateWithoutUserInput, EventApplicationUncheckedCreateWithoutUserInput>
  }

  export type EventApplicationUpdateWithWhereUniqueWithoutUserInput = {
    where: EventApplicationWhereUniqueInput
    data: XOR<EventApplicationUpdateWithoutUserInput, EventApplicationUncheckedUpdateWithoutUserInput>
  }

  export type EventApplicationUpdateManyWithWhereWithoutUserInput = {
    where: EventApplicationScalarWhereInput
    data: XOR<EventApplicationUpdateManyMutationInput, EventApplicationUncheckedUpdateManyWithoutUserInput>
  }

  export type EventApplicationScalarWhereInput = {
    AND?: EventApplicationScalarWhereInput | EventApplicationScalarWhereInput[]
    OR?: EventApplicationScalarWhereInput[]
    NOT?: EventApplicationScalarWhereInput | EventApplicationScalarWhereInput[]
    id?: UuidFilter<"EventApplication"> | string
    eventId?: UuidFilter<"EventApplication"> | string
    userId?: UuidFilter<"EventApplication"> | string
    status?: EnumApplicationStatusFilter<"EventApplication"> | $Enums.ApplicationStatus
    note?: StringNullableFilter<"EventApplication"> | string | null
    appliedAt?: DateTimeFilter<"EventApplication"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"EventApplication"> | Date | string | null
    reviewedBy?: UuidNullableFilter<"EventApplication"> | string | null
  }

  export type EventApplicationUpsertWithWhereUniqueWithoutReviewerInput = {
    where: EventApplicationWhereUniqueInput
    update: XOR<EventApplicationUpdateWithoutReviewerInput, EventApplicationUncheckedUpdateWithoutReviewerInput>
    create: XOR<EventApplicationCreateWithoutReviewerInput, EventApplicationUncheckedCreateWithoutReviewerInput>
  }

  export type EventApplicationUpdateWithWhereUniqueWithoutReviewerInput = {
    where: EventApplicationWhereUniqueInput
    data: XOR<EventApplicationUpdateWithoutReviewerInput, EventApplicationUncheckedUpdateWithoutReviewerInput>
  }

  export type EventApplicationUpdateManyWithWhereWithoutReviewerInput = {
    where: EventApplicationScalarWhereInput
    data: XOR<EventApplicationUpdateManyMutationInput, EventApplicationUncheckedUpdateManyWithoutReviewerInput>
  }

  export type TaskUpsertWithWhereUniqueWithoutAssigneeInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutAssigneeInput, TaskUncheckedUpdateWithoutAssigneeInput>
    create: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutAssigneeInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutAssigneeInput, TaskUncheckedUpdateWithoutAssigneeInput>
  }

  export type TaskUpdateManyWithWhereWithoutAssigneeInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutAssigneeInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: UuidFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringFilter<"Task"> | string
    eventId?: UuidNullableFilter<"Task"> | string | null
    assignedTo?: UuidFilter<"Task"> | string
    assignedBy?: UuidFilter<"Task"> | string
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    coinValue?: IntFilter<"Task"> | number
    submissionUrl?: StringNullableFilter<"Task"> | string | null
    submissionNote?: StringNullableFilter<"Task"> | string | null
    submittedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    reviewedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    reviewNote?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
  }

  export type TaskUpsertWithWhereUniqueWithoutAssignerInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutAssignerInput, TaskUncheckedUpdateWithoutAssignerInput>
    create: XOR<TaskCreateWithoutAssignerInput, TaskUncheckedCreateWithoutAssignerInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutAssignerInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutAssignerInput, TaskUncheckedUpdateWithoutAssignerInput>
  }

  export type TaskUpdateManyWithWhereWithoutAssignerInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutAssignerInput>
  }

  export type CoinTransactionUpsertWithWhereUniqueWithoutUserInput = {
    where: CoinTransactionWhereUniqueInput
    update: XOR<CoinTransactionUpdateWithoutUserInput, CoinTransactionUncheckedUpdateWithoutUserInput>
    create: XOR<CoinTransactionCreateWithoutUserInput, CoinTransactionUncheckedCreateWithoutUserInput>
  }

  export type CoinTransactionUpdateWithWhereUniqueWithoutUserInput = {
    where: CoinTransactionWhereUniqueInput
    data: XOR<CoinTransactionUpdateWithoutUserInput, CoinTransactionUncheckedUpdateWithoutUserInput>
  }

  export type CoinTransactionUpdateManyWithWhereWithoutUserInput = {
    where: CoinTransactionScalarWhereInput
    data: XOR<CoinTransactionUpdateManyMutationInput, CoinTransactionUncheckedUpdateManyWithoutUserInput>
  }

  export type CoinTransactionScalarWhereInput = {
    AND?: CoinTransactionScalarWhereInput | CoinTransactionScalarWhereInput[]
    OR?: CoinTransactionScalarWhereInput[]
    NOT?: CoinTransactionScalarWhereInput | CoinTransactionScalarWhereInput[]
    id?: UuidFilter<"CoinTransaction"> | string
    userId?: UuidFilter<"CoinTransaction"> | string
    type?: EnumTransactionTypeFilter<"CoinTransaction"> | $Enums.TransactionType
    amount?: IntFilter<"CoinTransaction"> | number
    description?: StringFilter<"CoinTransaction"> | string
    referenceId?: StringNullableFilter<"CoinTransaction"> | string | null
    referenceType?: StringNullableFilter<"CoinTransaction"> | string | null
    createdAt?: DateTimeFilter<"CoinTransaction"> | Date | string
  }

  export type WalletBalanceUpsertWithoutUserInput = {
    update: XOR<WalletBalanceUpdateWithoutUserInput, WalletBalanceUncheckedUpdateWithoutUserInput>
    create: XOR<WalletBalanceCreateWithoutUserInput, WalletBalanceUncheckedCreateWithoutUserInput>
    where?: WalletBalanceWhereInput
  }

  export type WalletBalanceUpdateToOneWithWhereWithoutUserInput = {
    where?: WalletBalanceWhereInput
    data: XOR<WalletBalanceUpdateWithoutUserInput, WalletBalanceUncheckedUpdateWithoutUserInput>
  }

  export type WalletBalanceUpdateWithoutUserInput = {
    totalEarned?: IntFieldUpdateOperationsInput | number
    totalRedeemed?: IntFieldUpdateOperationsInput | number
    currentBalance?: IntFieldUpdateOperationsInput | number
  }

  export type WalletBalanceUncheckedUpdateWithoutUserInput = {
    totalEarned?: IntFieldUpdateOperationsInput | number
    totalRedeemed?: IntFieldUpdateOperationsInput | number
    currentBalance?: IntFieldUpdateOperationsInput | number
  }

  export type AmbassadorUpsertWithoutUserInput = {
    update: XOR<AmbassadorUpdateWithoutUserInput, AmbassadorUncheckedUpdateWithoutUserInput>
    create: XOR<AmbassadorCreateWithoutUserInput, AmbassadorUncheckedCreateWithoutUserInput>
    where?: AmbassadorWhereInput
  }

  export type AmbassadorUpdateToOneWithWhereWithoutUserInput = {
    where?: AmbassadorWhereInput
    data: XOR<AmbassadorUpdateWithoutUserInput, AmbassadorUncheckedUpdateWithoutUserInput>
  }

  export type AmbassadorUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    referralCode?: StringFieldUpdateOperationsInput | string
    referralCount?: IntFieldUpdateOperationsInput | number
    totalCoinsEarned?: IntFieldUpdateOperationsInput | number
    tier?: EnumAmbassadorTierFieldUpdateOperationsInput | $Enums.AmbassadorTier
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUpdateManyWithoutReferrerNestedInput
  }

  export type AmbassadorUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    referralCode?: StringFieldUpdateOperationsInput | string
    referralCount?: IntFieldUpdateOperationsInput | number
    totalCoinsEarned?: IntFieldUpdateOperationsInput | number
    tier?: EnumAmbassadorTierFieldUpdateOperationsInput | $Enums.AmbassadorTier
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUncheckedUpdateManyWithoutReferrerNestedInput
  }

  export type StudentUpsertWithoutUserInput = {
    update: XOR<StudentUpdateWithoutUserInput, StudentUncheckedUpdateWithoutUserInput>
    create: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutUserInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutUserInput, StudentUncheckedUpdateWithoutUserInput>
  }

  export type StudentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    college?: NullableStringFieldUpdateOperationsInput | string | null
    course?: NullableStringFieldUpdateOperationsInput | string | null
    yearOfStudy?: NullableIntFieldUpdateOperationsInput | number | null
    ambassadorCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    referrer?: AmbassadorUpdateOneWithoutStudentsNestedInput
  }

  export type StudentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    college?: NullableStringFieldUpdateOperationsInput | string | null
    course?: NullableStringFieldUpdateOperationsInput | string | null
    yearOfStudy?: NullableIntFieldUpdateOperationsInput | number | null
    ambassadorCode?: NullableStringFieldUpdateOperationsInput | string | null
    referredBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: UuidFilter<"Notification"> | string
    userId?: UuidFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    referenceId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type ProfileCreateWithoutCompaniesOwnedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutCompaniesOwnedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutCompaniesOwnedInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutCompaniesOwnedInput, ProfileUncheckedCreateWithoutCompaniesOwnedInput>
  }

  export type EventCreateWithoutCompanyInput = {
    id?: string
    title: string
    description: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: ProfileCreateNestedOneWithoutEventsCreatedInput
    approver?: ProfileCreateNestedOneWithoutEventsApprovedInput
    requirements_list?: EventRequirementCreateNestedManyWithoutEventInput
    applications?: EventApplicationCreateNestedManyWithoutEventInput
    tasks?: TaskCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutCompanyInput = {
    id?: string
    title: string
    description: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements_list?: EventRequirementUncheckedCreateNestedManyWithoutEventInput
    applications?: EventApplicationUncheckedCreateNestedManyWithoutEventInput
    tasks?: TaskUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutCompanyInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutCompanyInput, EventUncheckedCreateWithoutCompanyInput>
  }

  export type EventCreateManyCompanyInputEnvelope = {
    data: EventCreateManyCompanyInput | EventCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpsertWithoutCompaniesOwnedInput = {
    update: XOR<ProfileUpdateWithoutCompaniesOwnedInput, ProfileUncheckedUpdateWithoutCompaniesOwnedInput>
    create: XOR<ProfileCreateWithoutCompaniesOwnedInput, ProfileUncheckedCreateWithoutCompaniesOwnedInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutCompaniesOwnedInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutCompaniesOwnedInput, ProfileUncheckedUpdateWithoutCompaniesOwnedInput>
  }

  export type ProfileUpdateWithoutCompaniesOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutCompaniesOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EventUpsertWithWhereUniqueWithoutCompanyInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutCompanyInput, EventUncheckedUpdateWithoutCompanyInput>
    create: XOR<EventCreateWithoutCompanyInput, EventUncheckedCreateWithoutCompanyInput>
  }

  export type EventUpdateWithWhereUniqueWithoutCompanyInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutCompanyInput, EventUncheckedUpdateWithoutCompanyInput>
  }

  export type EventUpdateManyWithWhereWithoutCompanyInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutCompanyInput>
  }

  export type CompanyCreateWithoutEventsInput = {
    id?: string
    name: string
    logoUrl?: string | null
    website?: string | null
    industry?: string | null
    description?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    contactPerson: ProfileCreateNestedOneWithoutCompaniesOwnedInput
  }

  export type CompanyUncheckedCreateWithoutEventsInput = {
    id?: string
    name: string
    logoUrl?: string | null
    website?: string | null
    industry?: string | null
    description?: string | null
    contactPersonId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyCreateOrConnectWithoutEventsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutEventsInput, CompanyUncheckedCreateWithoutEventsInput>
  }

  export type ProfileCreateWithoutEventsCreatedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutEventsCreatedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutEventsCreatedInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutEventsCreatedInput, ProfileUncheckedCreateWithoutEventsCreatedInput>
  }

  export type ProfileCreateWithoutEventsApprovedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutEventsApprovedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutEventsApprovedInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutEventsApprovedInput, ProfileUncheckedCreateWithoutEventsApprovedInput>
  }

  export type EventRequirementCreateWithoutEventInput = {
    id?: string
    label: string
    createdAt?: Date | string
  }

  export type EventRequirementUncheckedCreateWithoutEventInput = {
    id?: string
    label: string
    createdAt?: Date | string
  }

  export type EventRequirementCreateOrConnectWithoutEventInput = {
    where: EventRequirementWhereUniqueInput
    create: XOR<EventRequirementCreateWithoutEventInput, EventRequirementUncheckedCreateWithoutEventInput>
  }

  export type EventRequirementCreateManyEventInputEnvelope = {
    data: EventRequirementCreateManyEventInput | EventRequirementCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type EventApplicationCreateWithoutEventInput = {
    id?: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    user: ProfileCreateNestedOneWithoutEventApplicationsInput
    reviewer?: ProfileCreateNestedOneWithoutReviewedApplicationsInput
  }

  export type EventApplicationUncheckedCreateWithoutEventInput = {
    id?: string
    userId: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type EventApplicationCreateOrConnectWithoutEventInput = {
    where: EventApplicationWhereUniqueInput
    create: XOR<EventApplicationCreateWithoutEventInput, EventApplicationUncheckedCreateWithoutEventInput>
  }

  export type EventApplicationCreateManyEventInputEnvelope = {
    data: EventApplicationCreateManyEventInput | EventApplicationCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutEventInput = {
    id?: string
    title: string
    description: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignee: ProfileCreateNestedOneWithoutTasksAssignedInput
    assigner: ProfileCreateNestedOneWithoutTasksCreatedInput
  }

  export type TaskUncheckedCreateWithoutEventInput = {
    id?: string
    title: string
    description: string
    assignedTo: string
    assignedBy: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutEventInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutEventInput, TaskUncheckedCreateWithoutEventInput>
  }

  export type TaskCreateManyEventInputEnvelope = {
    data: TaskCreateManyEventInput | TaskCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithoutEventsInput = {
    update: XOR<CompanyUpdateWithoutEventsInput, CompanyUncheckedUpdateWithoutEventsInput>
    create: XOR<CompanyCreateWithoutEventsInput, CompanyUncheckedCreateWithoutEventsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutEventsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutEventsInput, CompanyUncheckedUpdateWithoutEventsInput>
  }

  export type CompanyUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contactPerson?: ProfileUpdateOneRequiredWithoutCompaniesOwnedNestedInput
  }

  export type CompanyUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    contactPersonId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUpsertWithoutEventsCreatedInput = {
    update: XOR<ProfileUpdateWithoutEventsCreatedInput, ProfileUncheckedUpdateWithoutEventsCreatedInput>
    create: XOR<ProfileCreateWithoutEventsCreatedInput, ProfileUncheckedCreateWithoutEventsCreatedInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutEventsCreatedInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutEventsCreatedInput, ProfileUncheckedUpdateWithoutEventsCreatedInput>
  }

  export type ProfileUpdateWithoutEventsCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutEventsCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProfileUpsertWithoutEventsApprovedInput = {
    update: XOR<ProfileUpdateWithoutEventsApprovedInput, ProfileUncheckedUpdateWithoutEventsApprovedInput>
    create: XOR<ProfileCreateWithoutEventsApprovedInput, ProfileUncheckedCreateWithoutEventsApprovedInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutEventsApprovedInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutEventsApprovedInput, ProfileUncheckedUpdateWithoutEventsApprovedInput>
  }

  export type ProfileUpdateWithoutEventsApprovedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutEventsApprovedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EventRequirementUpsertWithWhereUniqueWithoutEventInput = {
    where: EventRequirementWhereUniqueInput
    update: XOR<EventRequirementUpdateWithoutEventInput, EventRequirementUncheckedUpdateWithoutEventInput>
    create: XOR<EventRequirementCreateWithoutEventInput, EventRequirementUncheckedCreateWithoutEventInput>
  }

  export type EventRequirementUpdateWithWhereUniqueWithoutEventInput = {
    where: EventRequirementWhereUniqueInput
    data: XOR<EventRequirementUpdateWithoutEventInput, EventRequirementUncheckedUpdateWithoutEventInput>
  }

  export type EventRequirementUpdateManyWithWhereWithoutEventInput = {
    where: EventRequirementScalarWhereInput
    data: XOR<EventRequirementUpdateManyMutationInput, EventRequirementUncheckedUpdateManyWithoutEventInput>
  }

  export type EventRequirementScalarWhereInput = {
    AND?: EventRequirementScalarWhereInput | EventRequirementScalarWhereInput[]
    OR?: EventRequirementScalarWhereInput[]
    NOT?: EventRequirementScalarWhereInput | EventRequirementScalarWhereInput[]
    id?: UuidFilter<"EventRequirement"> | string
    eventId?: UuidFilter<"EventRequirement"> | string
    label?: StringFilter<"EventRequirement"> | string
    createdAt?: DateTimeFilter<"EventRequirement"> | Date | string
  }

  export type EventApplicationUpsertWithWhereUniqueWithoutEventInput = {
    where: EventApplicationWhereUniqueInput
    update: XOR<EventApplicationUpdateWithoutEventInput, EventApplicationUncheckedUpdateWithoutEventInput>
    create: XOR<EventApplicationCreateWithoutEventInput, EventApplicationUncheckedCreateWithoutEventInput>
  }

  export type EventApplicationUpdateWithWhereUniqueWithoutEventInput = {
    where: EventApplicationWhereUniqueInput
    data: XOR<EventApplicationUpdateWithoutEventInput, EventApplicationUncheckedUpdateWithoutEventInput>
  }

  export type EventApplicationUpdateManyWithWhereWithoutEventInput = {
    where: EventApplicationScalarWhereInput
    data: XOR<EventApplicationUpdateManyMutationInput, EventApplicationUncheckedUpdateManyWithoutEventInput>
  }

  export type TaskUpsertWithWhereUniqueWithoutEventInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutEventInput, TaskUncheckedUpdateWithoutEventInput>
    create: XOR<TaskCreateWithoutEventInput, TaskUncheckedCreateWithoutEventInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutEventInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutEventInput, TaskUncheckedUpdateWithoutEventInput>
  }

  export type TaskUpdateManyWithWhereWithoutEventInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutEventInput>
  }

  export type EventCreateWithoutRequirements_listInput = {
    id?: string
    title: string
    description: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutEventsInput
    creator: ProfileCreateNestedOneWithoutEventsCreatedInput
    approver?: ProfileCreateNestedOneWithoutEventsApprovedInput
    applications?: EventApplicationCreateNestedManyWithoutEventInput
    tasks?: TaskCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutRequirements_listInput = {
    id?: string
    title: string
    description: string
    companyId: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: EventApplicationUncheckedCreateNestedManyWithoutEventInput
    tasks?: TaskUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutRequirements_listInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutRequirements_listInput, EventUncheckedCreateWithoutRequirements_listInput>
  }

  export type EventUpsertWithoutRequirements_listInput = {
    update: XOR<EventUpdateWithoutRequirements_listInput, EventUncheckedUpdateWithoutRequirements_listInput>
    create: XOR<EventCreateWithoutRequirements_listInput, EventUncheckedCreateWithoutRequirements_listInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutRequirements_listInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutRequirements_listInput, EventUncheckedUpdateWithoutRequirements_listInput>
  }

  export type EventUpdateWithoutRequirements_listInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutEventsNestedInput
    creator?: ProfileUpdateOneRequiredWithoutEventsCreatedNestedInput
    approver?: ProfileUpdateOneWithoutEventsApprovedNestedInput
    applications?: EventApplicationUpdateManyWithoutEventNestedInput
    tasks?: TaskUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutRequirements_listInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: EventApplicationUncheckedUpdateManyWithoutEventNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateWithoutApplicationsInput = {
    id?: string
    title: string
    description: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutEventsInput
    creator: ProfileCreateNestedOneWithoutEventsCreatedInput
    approver?: ProfileCreateNestedOneWithoutEventsApprovedInput
    requirements_list?: EventRequirementCreateNestedManyWithoutEventInput
    tasks?: TaskCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutApplicationsInput = {
    id?: string
    title: string
    description: string
    companyId: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements_list?: EventRequirementUncheckedCreateNestedManyWithoutEventInput
    tasks?: TaskUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutApplicationsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutApplicationsInput, EventUncheckedCreateWithoutApplicationsInput>
  }

  export type ProfileCreateWithoutEventApplicationsInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutEventApplicationsInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutEventApplicationsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutEventApplicationsInput, ProfileUncheckedCreateWithoutEventApplicationsInput>
  }

  export type ProfileCreateWithoutReviewedApplicationsInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutReviewedApplicationsInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutReviewedApplicationsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutReviewedApplicationsInput, ProfileUncheckedCreateWithoutReviewedApplicationsInput>
  }

  export type EventUpsertWithoutApplicationsInput = {
    update: XOR<EventUpdateWithoutApplicationsInput, EventUncheckedUpdateWithoutApplicationsInput>
    create: XOR<EventCreateWithoutApplicationsInput, EventUncheckedCreateWithoutApplicationsInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutApplicationsInput, EventUncheckedUpdateWithoutApplicationsInput>
  }

  export type EventUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutEventsNestedInput
    creator?: ProfileUpdateOneRequiredWithoutEventsCreatedNestedInput
    approver?: ProfileUpdateOneWithoutEventsApprovedNestedInput
    requirements_list?: EventRequirementUpdateManyWithoutEventNestedInput
    tasks?: TaskUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements_list?: EventRequirementUncheckedUpdateManyWithoutEventNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutEventNestedInput
  }

  export type ProfileUpsertWithoutEventApplicationsInput = {
    update: XOR<ProfileUpdateWithoutEventApplicationsInput, ProfileUncheckedUpdateWithoutEventApplicationsInput>
    create: XOR<ProfileCreateWithoutEventApplicationsInput, ProfileUncheckedCreateWithoutEventApplicationsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutEventApplicationsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutEventApplicationsInput, ProfileUncheckedUpdateWithoutEventApplicationsInput>
  }

  export type ProfileUpdateWithoutEventApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutEventApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProfileUpsertWithoutReviewedApplicationsInput = {
    update: XOR<ProfileUpdateWithoutReviewedApplicationsInput, ProfileUncheckedUpdateWithoutReviewedApplicationsInput>
    create: XOR<ProfileCreateWithoutReviewedApplicationsInput, ProfileUncheckedCreateWithoutReviewedApplicationsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutReviewedApplicationsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutReviewedApplicationsInput, ProfileUncheckedUpdateWithoutReviewedApplicationsInput>
  }

  export type ProfileUpdateWithoutReviewedApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutReviewedApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EventCreateWithoutTasksInput = {
    id?: string
    title: string
    description: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutEventsInput
    creator: ProfileCreateNestedOneWithoutEventsCreatedInput
    approver?: ProfileCreateNestedOneWithoutEventsApprovedInput
    requirements_list?: EventRequirementCreateNestedManyWithoutEventInput
    applications?: EventApplicationCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutTasksInput = {
    id?: string
    title: string
    description: string
    companyId: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements_list?: EventRequirementUncheckedCreateNestedManyWithoutEventInput
    applications?: EventApplicationUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutTasksInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutTasksInput, EventUncheckedCreateWithoutTasksInput>
  }

  export type ProfileCreateWithoutTasksAssignedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutTasksAssignedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutTasksAssignedInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutTasksAssignedInput, ProfileUncheckedCreateWithoutTasksAssignedInput>
  }

  export type ProfileCreateWithoutTasksCreatedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutTasksCreatedInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutTasksCreatedInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutTasksCreatedInput, ProfileUncheckedCreateWithoutTasksCreatedInput>
  }

  export type EventUpsertWithoutTasksInput = {
    update: XOR<EventUpdateWithoutTasksInput, EventUncheckedUpdateWithoutTasksInput>
    create: XOR<EventCreateWithoutTasksInput, EventUncheckedCreateWithoutTasksInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutTasksInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutTasksInput, EventUncheckedUpdateWithoutTasksInput>
  }

  export type EventUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutEventsNestedInput
    creator?: ProfileUpdateOneRequiredWithoutEventsCreatedNestedInput
    approver?: ProfileUpdateOneWithoutEventsApprovedNestedInput
    requirements_list?: EventRequirementUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements_list?: EventRequirementUncheckedUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUncheckedUpdateManyWithoutEventNestedInput
  }

  export type ProfileUpsertWithoutTasksAssignedInput = {
    update: XOR<ProfileUpdateWithoutTasksAssignedInput, ProfileUncheckedUpdateWithoutTasksAssignedInput>
    create: XOR<ProfileCreateWithoutTasksAssignedInput, ProfileUncheckedCreateWithoutTasksAssignedInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutTasksAssignedInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutTasksAssignedInput, ProfileUncheckedUpdateWithoutTasksAssignedInput>
  }

  export type ProfileUpdateWithoutTasksAssignedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutTasksAssignedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProfileUpsertWithoutTasksCreatedInput = {
    update: XOR<ProfileUpdateWithoutTasksCreatedInput, ProfileUncheckedUpdateWithoutTasksCreatedInput>
    create: XOR<ProfileCreateWithoutTasksCreatedInput, ProfileUncheckedCreateWithoutTasksCreatedInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutTasksCreatedInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutTasksCreatedInput, ProfileUncheckedUpdateWithoutTasksCreatedInput>
  }

  export type ProfileUpdateWithoutTasksCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutTasksCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProfileCreateWithoutWalletBalanceInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutWalletBalanceInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutWalletBalanceInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutWalletBalanceInput, ProfileUncheckedCreateWithoutWalletBalanceInput>
  }

  export type ProfileUpsertWithoutWalletBalanceInput = {
    update: XOR<ProfileUpdateWithoutWalletBalanceInput, ProfileUncheckedUpdateWithoutWalletBalanceInput>
    create: XOR<ProfileCreateWithoutWalletBalanceInput, ProfileUncheckedCreateWithoutWalletBalanceInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutWalletBalanceInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutWalletBalanceInput, ProfileUncheckedUpdateWithoutWalletBalanceInput>
  }

  export type ProfileUpdateWithoutWalletBalanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutWalletBalanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProfileCreateWithoutCoinTransactionsInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutCoinTransactionsInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutCoinTransactionsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutCoinTransactionsInput, ProfileUncheckedCreateWithoutCoinTransactionsInput>
  }

  export type ProfileUpsertWithoutCoinTransactionsInput = {
    update: XOR<ProfileUpdateWithoutCoinTransactionsInput, ProfileUncheckedUpdateWithoutCoinTransactionsInput>
    create: XOR<ProfileCreateWithoutCoinTransactionsInput, ProfileUncheckedCreateWithoutCoinTransactionsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutCoinTransactionsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutCoinTransactionsInput, ProfileUncheckedUpdateWithoutCoinTransactionsInput>
  }

  export type ProfileUpdateWithoutCoinTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutCoinTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProfileCreateWithoutAmbassadorInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutAmbassadorInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutAmbassadorInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutAmbassadorInput, ProfileUncheckedCreateWithoutAmbassadorInput>
  }

  export type StudentCreateWithoutReferrerInput = {
    id?: string
    college?: string | null
    course?: string | null
    yearOfStudy?: number | null
    ambassadorCode?: string | null
    createdAt?: Date | string
    user: ProfileCreateNestedOneWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutReferrerInput = {
    id?: string
    userId: string
    college?: string | null
    course?: string | null
    yearOfStudy?: number | null
    ambassadorCode?: string | null
    createdAt?: Date | string
  }

  export type StudentCreateOrConnectWithoutReferrerInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutReferrerInput, StudentUncheckedCreateWithoutReferrerInput>
  }

  export type StudentCreateManyReferrerInputEnvelope = {
    data: StudentCreateManyReferrerInput | StudentCreateManyReferrerInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpsertWithoutAmbassadorInput = {
    update: XOR<ProfileUpdateWithoutAmbassadorInput, ProfileUncheckedUpdateWithoutAmbassadorInput>
    create: XOR<ProfileCreateWithoutAmbassadorInput, ProfileUncheckedCreateWithoutAmbassadorInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutAmbassadorInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutAmbassadorInput, ProfileUncheckedUpdateWithoutAmbassadorInput>
  }

  export type ProfileUpdateWithoutAmbassadorInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutAmbassadorInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type StudentUpsertWithWhereUniqueWithoutReferrerInput = {
    where: StudentWhereUniqueInput
    update: XOR<StudentUpdateWithoutReferrerInput, StudentUncheckedUpdateWithoutReferrerInput>
    create: XOR<StudentCreateWithoutReferrerInput, StudentUncheckedCreateWithoutReferrerInput>
  }

  export type StudentUpdateWithWhereUniqueWithoutReferrerInput = {
    where: StudentWhereUniqueInput
    data: XOR<StudentUpdateWithoutReferrerInput, StudentUncheckedUpdateWithoutReferrerInput>
  }

  export type StudentUpdateManyWithWhereWithoutReferrerInput = {
    where: StudentScalarWhereInput
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyWithoutReferrerInput>
  }

  export type StudentScalarWhereInput = {
    AND?: StudentScalarWhereInput | StudentScalarWhereInput[]
    OR?: StudentScalarWhereInput[]
    NOT?: StudentScalarWhereInput | StudentScalarWhereInput[]
    id?: UuidFilter<"Student"> | string
    userId?: UuidFilter<"Student"> | string
    college?: StringNullableFilter<"Student"> | string | null
    course?: StringNullableFilter<"Student"> | string | null
    yearOfStudy?: IntNullableFilter<"Student"> | number | null
    ambassadorCode?: StringNullableFilter<"Student"> | string | null
    referredBy?: UuidNullableFilter<"Student"> | string | null
    createdAt?: DateTimeFilter<"Student"> | Date | string
  }

  export type ProfileCreateWithoutStudentInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutStudentInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutStudentInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutStudentInput, ProfileUncheckedCreateWithoutStudentInput>
  }

  export type AmbassadorCreateWithoutStudentsInput = {
    id?: string
    referralCode: string
    referralCount?: number
    totalCoinsEarned?: number
    tier?: $Enums.AmbassadorTier
    isActive?: boolean
    createdAt?: Date | string
    user: ProfileCreateNestedOneWithoutAmbassadorInput
  }

  export type AmbassadorUncheckedCreateWithoutStudentsInput = {
    id?: string
    userId: string
    referralCode: string
    referralCount?: number
    totalCoinsEarned?: number
    tier?: $Enums.AmbassadorTier
    isActive?: boolean
    createdAt?: Date | string
  }

  export type AmbassadorCreateOrConnectWithoutStudentsInput = {
    where: AmbassadorWhereUniqueInput
    create: XOR<AmbassadorCreateWithoutStudentsInput, AmbassadorUncheckedCreateWithoutStudentsInput>
  }

  export type ProfileUpsertWithoutStudentInput = {
    update: XOR<ProfileUpdateWithoutStudentInput, ProfileUncheckedUpdateWithoutStudentInput>
    create: XOR<ProfileCreateWithoutStudentInput, ProfileUncheckedCreateWithoutStudentInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutStudentInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutStudentInput, ProfileUncheckedUpdateWithoutStudentInput>
  }

  export type ProfileUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AmbassadorUpsertWithoutStudentsInput = {
    update: XOR<AmbassadorUpdateWithoutStudentsInput, AmbassadorUncheckedUpdateWithoutStudentsInput>
    create: XOR<AmbassadorCreateWithoutStudentsInput, AmbassadorUncheckedCreateWithoutStudentsInput>
    where?: AmbassadorWhereInput
  }

  export type AmbassadorUpdateToOneWithWhereWithoutStudentsInput = {
    where?: AmbassadorWhereInput
    data: XOR<AmbassadorUpdateWithoutStudentsInput, AmbassadorUncheckedUpdateWithoutStudentsInput>
  }

  export type AmbassadorUpdateWithoutStudentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    referralCode?: StringFieldUpdateOperationsInput | string
    referralCount?: IntFieldUpdateOperationsInput | number
    totalCoinsEarned?: IntFieldUpdateOperationsInput | number
    tier?: EnumAmbassadorTierFieldUpdateOperationsInput | $Enums.AmbassadorTier
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ProfileUpdateOneRequiredWithoutAmbassadorNestedInput
  }

  export type AmbassadorUncheckedUpdateWithoutStudentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    referralCode?: StringFieldUpdateOperationsInput | string
    referralCount?: IntFieldUpdateOperationsInput | number
    totalCoinsEarned?: IntFieldUpdateOperationsInput | number
    tier?: EnumAmbassadorTierFieldUpdateOperationsInput | $Enums.AmbassadorTier
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateWithoutNotificationsInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorCreateNestedOneWithoutUserInput
    student?: StudentCreateNestedOneWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutNotificationsInput = {
    id: string
    email: string
    fullName: string
    avatarUrl?: string | null
    role?: $Enums.UserRole
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    companiesOwned?: CompanyUncheckedCreateNestedManyWithoutContactPersonInput
    eventsCreated?: EventUncheckedCreateNestedManyWithoutCreatorInput
    eventsApproved?: EventUncheckedCreateNestedManyWithoutApproverInput
    eventApplications?: EventApplicationUncheckedCreateNestedManyWithoutUserInput
    reviewedApplications?: EventApplicationUncheckedCreateNestedManyWithoutReviewerInput
    tasksAssigned?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    tasksCreated?: TaskUncheckedCreateNestedManyWithoutAssignerInput
    coinTransactions?: CoinTransactionUncheckedCreateNestedManyWithoutUserInput
    walletBalance?: WalletBalanceUncheckedCreateNestedOneWithoutUserInput
    ambassador?: AmbassadorUncheckedCreateNestedOneWithoutUserInput
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutNotificationsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutNotificationsInput, ProfileUncheckedCreateWithoutNotificationsInput>
  }

  export type ProfileUpsertWithoutNotificationsInput = {
    update: XOR<ProfileUpdateWithoutNotificationsInput, ProfileUncheckedUpdateWithoutNotificationsInput>
    create: XOR<ProfileCreateWithoutNotificationsInput, ProfileUncheckedCreateWithoutNotificationsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutNotificationsInput, ProfileUncheckedUpdateWithoutNotificationsInput>
  }

  export type ProfileUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUpdateOneWithoutUserNestedInput
    student?: StudentUpdateOneWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companiesOwned?: CompanyUncheckedUpdateManyWithoutContactPersonNestedInput
    eventsCreated?: EventUncheckedUpdateManyWithoutCreatorNestedInput
    eventsApproved?: EventUncheckedUpdateManyWithoutApproverNestedInput
    eventApplications?: EventApplicationUncheckedUpdateManyWithoutUserNestedInput
    reviewedApplications?: EventApplicationUncheckedUpdateManyWithoutReviewerNestedInput
    tasksAssigned?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    tasksCreated?: TaskUncheckedUpdateManyWithoutAssignerNestedInput
    coinTransactions?: CoinTransactionUncheckedUpdateManyWithoutUserNestedInput
    walletBalance?: WalletBalanceUncheckedUpdateOneWithoutUserNestedInput
    ambassador?: AmbassadorUncheckedUpdateOneWithoutUserNestedInput
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
  }

  export type CompanyCreateManyContactPersonInput = {
    id?: string
    name: string
    logoUrl?: string | null
    website?: string | null
    industry?: string | null
    description?: string | null
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventCreateManyCreatorInput = {
    id?: string
    title: string
    description: string
    companyId: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventCreateManyApproverInput = {
    id?: string
    title: string
    description: string
    companyId: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    createdBy: string
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventApplicationCreateManyUserInput = {
    id?: string
    eventId: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type EventApplicationCreateManyReviewerInput = {
    id?: string
    eventId: string
    userId: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
  }

  export type TaskCreateManyAssigneeInput = {
    id?: string
    title: string
    description: string
    eventId?: string | null
    assignedBy: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateManyAssignerInput = {
    id?: string
    title: string
    description: string
    eventId?: string | null
    assignedTo: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CoinTransactionCreateManyUserInput = {
    id?: string
    type: $Enums.TransactionType
    amount: number
    description: string
    referenceId?: string | null
    referenceType?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    title: string
    body: string
    type: string
    referenceId?: string | null
    isRead?: boolean
    createdAt?: Date | string
  }

  export type CompanyUpdateWithoutContactPersonInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutContactPersonInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateManyWithoutContactPersonInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutEventsNestedInput
    approver?: ProfileUpdateOneWithoutEventsApprovedNestedInput
    requirements_list?: EventRequirementUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUpdateManyWithoutEventNestedInput
    tasks?: TaskUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements_list?: EventRequirementUncheckedUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUncheckedUpdateManyWithoutEventNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUpdateWithoutApproverInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutEventsNestedInput
    creator?: ProfileUpdateOneRequiredWithoutEventsCreatedNestedInput
    requirements_list?: EventRequirementUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUpdateManyWithoutEventNestedInput
    tasks?: TaskUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutApproverInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements_list?: EventRequirementUncheckedUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUncheckedUpdateManyWithoutEventNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateManyWithoutApproverInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventApplicationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    event?: EventUpdateOneRequiredWithoutApplicationsNestedInput
    reviewer?: ProfileUpdateOneWithoutReviewedApplicationsNestedInput
  }

  export type EventApplicationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventApplicationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventApplicationUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    event?: EventUpdateOneRequiredWithoutApplicationsNestedInput
    user?: ProfileUpdateOneRequiredWithoutEventApplicationsNestedInput
  }

  export type EventApplicationUncheckedUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EventApplicationUncheckedUpdateManyWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUpdateWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneWithoutTasksNestedInput
    assigner?: ProfileUpdateOneRequiredWithoutTasksCreatedNestedInput
  }

  export type TaskUncheckedUpdateWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutAssignerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneWithoutTasksNestedInput
    assignee?: ProfileUpdateOneRequiredWithoutTasksAssignedNestedInput
  }

  export type TaskUncheckedUpdateWithoutAssignerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutAssignerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTo?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CoinTransactionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    referenceType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CoinTransactionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    referenceType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CoinTransactionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amount?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    referenceType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateManyCompanyInput = {
    id?: string
    title: string
    description: string
    eventDate: Date | string
    eventTime?: Date | string | null
    location: string
    locationUrl?: string | null
    category: string
    bannerUrl?: string | null
    maxAttendees?: number | null
    currentAttendees?: number
    status?: $Enums.EventStatus
    requirements?: string | null
    coinReward?: number
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: ProfileUpdateOneRequiredWithoutEventsCreatedNestedInput
    approver?: ProfileUpdateOneWithoutEventsApprovedNestedInput
    requirements_list?: EventRequirementUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUpdateManyWithoutEventNestedInput
    tasks?: TaskUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements_list?: EventRequirementUncheckedUpdateManyWithoutEventNestedInput
    applications?: EventApplicationUncheckedUpdateManyWithoutEventNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: StringFieldUpdateOperationsInput | string
    locationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    bannerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    maxAttendees?: NullableIntFieldUpdateOperationsInput | number | null
    currentAttendees?: IntFieldUpdateOperationsInput | number
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    coinReward?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventRequirementCreateManyEventInput = {
    id?: string
    label: string
    createdAt?: Date | string
  }

  export type EventApplicationCreateManyEventInput = {
    id?: string
    userId: string
    status?: $Enums.ApplicationStatus
    note?: string | null
    appliedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type TaskCreateManyEventInput = {
    id?: string
    title: string
    description: string
    assignedTo: string
    assignedBy: string
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    coinValue?: number
    submissionUrl?: string | null
    submissionNote?: string | null
    submittedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventRequirementUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventRequirementUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventRequirementUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventApplicationUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: ProfileUpdateOneRequiredWithoutEventApplicationsNestedInput
    reviewer?: ProfileUpdateOneWithoutReviewedApplicationsNestedInput
  }

  export type EventApplicationUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventApplicationUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    note?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignee?: ProfileUpdateOneRequiredWithoutTasksAssignedNestedInput
    assigner?: ProfileUpdateOneRequiredWithoutTasksCreatedNestedInput
  }

  export type TaskUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    assignedTo?: StringFieldUpdateOperationsInput | string
    assignedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    assignedTo?: StringFieldUpdateOperationsInput | string
    assignedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coinValue?: IntFieldUpdateOperationsInput | number
    submissionUrl?: NullableStringFieldUpdateOperationsInput | string | null
    submissionNote?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCreateManyReferrerInput = {
    id?: string
    userId: string
    college?: string | null
    course?: string | null
    yearOfStudy?: number | null
    ambassadorCode?: string | null
    createdAt?: Date | string
  }

  export type StudentUpdateWithoutReferrerInput = {
    id?: StringFieldUpdateOperationsInput | string
    college?: NullableStringFieldUpdateOperationsInput | string | null
    course?: NullableStringFieldUpdateOperationsInput | string | null
    yearOfStudy?: NullableIntFieldUpdateOperationsInput | number | null
    ambassadorCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ProfileUpdateOneRequiredWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutReferrerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    college?: NullableStringFieldUpdateOperationsInput | string | null
    course?: NullableStringFieldUpdateOperationsInput | string | null
    yearOfStudy?: NullableIntFieldUpdateOperationsInput | number | null
    ambassadorCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUncheckedUpdateManyWithoutReferrerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    college?: NullableStringFieldUpdateOperationsInput | string | null
    course?: NullableStringFieldUpdateOperationsInput | string | null
    yearOfStudy?: NullableIntFieldUpdateOperationsInput | number | null
    ambassadorCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ProfileCountOutputTypeDefaultArgs instead
     */
    export type ProfileCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProfileCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompanyCountOutputTypeDefaultArgs instead
     */
    export type CompanyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompanyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventCountOutputTypeDefaultArgs instead
     */
    export type EventCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AmbassadorCountOutputTypeDefaultArgs instead
     */
    export type AmbassadorCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AmbassadorCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProfileDefaultArgs instead
     */
    export type ProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProfileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompanyDefaultArgs instead
     */
    export type CompanyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompanyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventDefaultArgs instead
     */
    export type EventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventRequirementDefaultArgs instead
     */
    export type EventRequirementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventRequirementDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventApplicationDefaultArgs instead
     */
    export type EventApplicationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventApplicationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskDefaultArgs instead
     */
    export type TaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WalletBalanceDefaultArgs instead
     */
    export type WalletBalanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WalletBalanceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CoinTransactionDefaultArgs instead
     */
    export type CoinTransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CoinTransactionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AmbassadorDefaultArgs instead
     */
    export type AmbassadorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AmbassadorDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudentDefaultArgs instead
     */
    export type StudentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationDefaultArgs instead
     */
    export type NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}