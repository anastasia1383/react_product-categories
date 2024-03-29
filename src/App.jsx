/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import classNames from 'classnames';

import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return {
    product,
    category,
    user,
  };
});

function getPreparedProducts(productsArray, option) {
  const { query = '', selectedUser = 'all', selectedProduct = [] } = option;

  let preparedProducts = [...productsArray];

  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery) {
    preparedProducts = preparedProducts
      .filter(prepared => prepared.product.name
        .toLowerCase().includes(normalizedQuery));
  }

  if (selectedUser !== 'all') {
    preparedProducts = preparedProducts.filter(
      prepared => prepared.user.name === selectedUser,
    );
  }

  if (selectedProduct.length) {
    preparedProducts = preparedProducts
      .filter(prepared => selectedProduct.includes(prepared.category.title));
  }

  return preparedProducts;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [query, setQuery] = useState('');

  const visibleProducts = getPreparedProducts(products, {
    query,
    selectedUser,
    selectedProduct,
  });

  const resetFilters = () => {
    setQuery('');
    setSelectedProduct([]);
    setSelectedUser('all');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({ 'is-active': selectedUser === 'all' })}
                onClick={() => {
                  setSelectedUser('all');
                }}
              >
                All
              </a>

              {usersFromServer.map(({ id, name }) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={id}
                  className={classNames({ 'is-active': selectedUser === name })}
                  onClick={() => {
                    setSelectedUser(name);
                  }}
                >
                  {name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => {
                      setQuery('');
                    }}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => {
                  setSelectedProduct([]);
                }}
              >
                All
              </a>
              {categoriesFromServer.map(({ id, title }) => (
                <a
                  key={id}
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': selectedProduct.includes(title),
                  })}
                  href="#/"
                  onClick={() => {
                    let newValue = [...selectedProduct];

                    if (selectedProduct.includes(title)) {
                      newValue = newValue.filter(item => item !== title);
                    } else {
                      newValue.push(title);
                    }

                    setSelectedProduct(newValue);
                  }}
                >
                  {title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
              {visibleProducts.map(({ product, category, user }) => (
                <tbody key={product.id}>
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': user.sex === 'm',
                        'has-text-danger': user.sex === 'f',
                      })}
                    >
                      {user.name}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
