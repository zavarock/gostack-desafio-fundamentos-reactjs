import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';
import SortColumn from '../../components/SortColumn';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const query = new URLSearchParams(useLocation().search);
  const sort = query.get('sort');

  useEffect(() => {
    let queryParams = {};

    if (sort !== null) {
      queryParams = { sort };
    }

    api.get(`/transactions`, { params: queryParams }).then(response => {
      setTransactions(
        response.data.transactions.map((transaction: Transaction) => {
          const createdAt = new Date(transaction.created_at);

          return {
            id: transaction.id,
            title: transaction.title,
            value: transaction.value,
            formattedValue: formatValue(transaction.value),
            formattedDate: formatDate(createdAt),
            type: transaction.type,
            category: { title: transaction.category.title },
            createdAt,
          };
        }),
      );

      setBalance(response.data.balance);
    });
  }, [sort]);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Sa??das</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(balance.outcome)}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  <SortColumn name="title">T??tulo</SortColumn>
                </th>
                <th>
                  <SortColumn name="value">Pre??o</SortColumn>
                </th>
                <th>
                  <SortColumn name="category">Categoria</SortColumn>
                </th>
                <th>
                  <SortColumn name="created_at">T??tulo</SortColumn>
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'outcome' && '- '}
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
