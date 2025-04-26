import { config } from "@/config";
import { gql, request } from "graphql-request";

export const queryUP = async <T>(
  query: string,
  variables: Record<string, string> | undefined
): Promise<T> => {
  return (await request(config.ENVIO_URL, query, variables)) as T;
};

export const QUERY_PROFILE_BY_ADDRESS = gql`
  query profile($id: String!) {
    profile: Profile_by_pk(id: $id) {
      fullName
      description
      name
      id
      standard
      interfaces
      blockNumber
      links {
        title
        url
      }
      tags
      backgroundImages(order_by: { width: desc }) {
        url: src
        height
        width
        verified
        error
      }
      profileImages(order_by: { width: desc }) {
        url: src
        width
        height
        verified
        error
      }
      avatars {
        url
        fileType
      }
      isEOA
    }
  }
`;
