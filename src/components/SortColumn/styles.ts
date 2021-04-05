import styled, { css } from 'styled-components';

import { Link } from 'react-router-dom';

import chevronIcon from '../../assets/chevron.svg';

interface SortLinkProps {
  $isActive: boolean;
  $isDescending: boolean;
}

export const SortLink = styled(Link)<SortLinkProps>`
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  position: relative;
  padding-right: 20px;

  &:after {
    position: absolute;
    content: '';
    mask-image: url(${chevronIcon});
    mask-repeat: no-repeat;
    background-color: #969cb3;
    right: 0;
    width: 10px;
    height: 6px;
  }

  &:hover {
    &:after {
      background-color: #ff872c;
    }
  }

  ${props =>
    props.$isActive &&
    css`
      &:after {
        background-color: #ff872c;
      }

      ${props.$isDescending &&
      css`
        &:after {
          transform: rotate(180deg);
        }
      `}
    `}
`;
