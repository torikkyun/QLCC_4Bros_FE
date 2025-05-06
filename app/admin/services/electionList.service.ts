import { getToken } from '../../(auth)/authStorage';

const API_URL = 'http://103.167.89.178:3000/api/election?page=1&limit=10&order=desc';

export const fetchElections = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error('Người dùng chưa đăng nhập');
  }

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch Elections');
  }

  const json = await response.json();
  return json.data;
};