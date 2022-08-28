import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchContext } from '../App';

import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';
import { setCategoryId } from '../redux/slices/filterSlice';

const Home = () => {
  // https://62fe749f41165d66bfc0726b.mockapi.io/api/v1/items

  const dispatch   = useDispatch();
  const categoryId = useSelector(state => state.filter.categoryId);
  const sortType   = useSelector(state => state.filter.sort.sortProperty);

  const [ items, setItems ]             = useState([]);
  const [ isLoading, setIsLoading ]     = useState(true);
  const [ currentPage, setCurrentPage ] = useState(1);

  const { searchValue } = useContext(SearchContext);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  console.log(`id category: ${ categoryId }`);

  useEffect(() => {
    setIsLoading(true);

    const category = categoryId > 0 ? `&category=${ categoryId }` : ``;
    const sortBy   = `&sortBy=` + sortType.replace('-', '');
    const order    = `&order=${ sortType.includes('-') ? 'asc' : 'desc' }`;
    const search   = searchValue ? `&search=${ searchValue }` : '';

    fetch(`https://62fe749f41165d66bfc0726b.mockapi.io/api/v1/items?page=${ currentPage }&limit=4${ sortBy }${ order }${ category }${ search }`)
      .then(res => res.json())
      .then(arr => {
        setItems(arr);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [ categoryId, sortType, searchValue, currentPage ]);

  const pizzas    = items
    // .filter(obj => obj.name.toLowerCase().includes(searchValue.toLowerCase()))
    .map(obj => <PizzaBlock { ...obj } key={ obj.id }/>);
  const skeletons = [ ...new Array(4) ].map((_, idx) => <Skeleton key={ idx }/>);

  return (<div className="container">
    <div className="content__top">
      <Categories value={ categoryId } onClickCategory={ onChangeCategory }/>
      <Sort/>
    </div>
    <h2 className="content__title">Все пиццы</h2>
    <div className="content__items">
      { isLoading ? skeletons : pizzas }
    </div>
    <div className="content__paginator">
      <Pagination onChangePage={ number => setCurrentPage(number) }/>
    </div>
  </div>);
};

export default Home;