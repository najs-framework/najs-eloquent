import 'jest'
import { init_knex, knex_run_sql } from '../util'
// import { KnexProvider } from '../../lib/facades/global/KnexProviderFacade'

describe('KnexQueryBuilder', function() {
  beforeAll(async function() {
    return init_knex('najs_eloquent_knex_query_builder').then(function() {
      return knex_run_sql(`CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        created_at DATETIME,
        updated_at DATETIME,
        deleted_at DATETIME,
        age INT,
        PRIMARY KEY (id)
      )`)
    })
  })

  it('should work', function() {})
})
