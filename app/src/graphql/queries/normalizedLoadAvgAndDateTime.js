import { gql } from 'apollo-boost';

export default gql`
  {
    cpu {
      normalizedLoadAvg
    }
    datetime
  }
`;
