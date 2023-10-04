import { useState } from "react";
import { without } from "underscore";
import { t } from "ttag";
import { useUserListQuery } from "metabase/common/hooks/use-user-list-query";
import type { UserId, UserListResult } from "metabase-types/api";
import { UserListElement } from "metabase/search/components/UserListElement";
import { SearchFilterPopoverWrapper } from "metabase/search/components/SearchFilterPopoverWrapper";
import {
  SearchUserPickerContainer,
  SearchUserPickerContent,
  SearchUserSelectBox,
  SelectedUserButton,
} from "metabase/search/components/SearchUserPicker/SearchUserPicker.styled";
import { Center, Text, TextInput, Group } from "metabase/ui";
import { Icon } from "metabase/core/components/Icon";

export const SearchUserPicker = ({
  value,
  onChange,
}: {
  value: UserId[];
  onChange: (value: UserId[]) => void;
}) => {
  const { data: users = [], isLoading } = useUserListQuery();

  const [userFilter, setUserFilter] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState(value);

  const filteredUsers = users.filter(user => {
    return user.common_name.toLowerCase().includes(userFilter.toLowerCase());
  });

  const isSelected = (user: UserListResult) =>
    selectedUserIds.includes(user.id);

  const onUserSelect = (user: UserListResult) => {
    if (isSelected(user)) {
      setSelectedUserIds(without(selectedUserIds, user.id));
    } else {
      setSelectedUserIds([...selectedUserIds, user.id]);
    }
  };

  const generateUserListElements = (userList: UserListResult[]) => {
    return userList.map(user => (
      <UserListElement
        key={user.id}
        isSelected={isSelected(user)}
        onClick={onUserSelect}
        value={user}
      />
    ));
  };

  return (
    <SearchFilterPopoverWrapper
      isLoading={isLoading}
      onApply={() => onChange(selectedUserIds)}
    >
      <SearchUserPickerContainer p="sm" h="100%" spacing="sm">
        <SearchUserSelectBox
          data-testid="search-user-select-box"
          spacing="xs"
          p="xs"
        >
          {selectedUserIds.map(userId => {
            const user = users.find(user => user.id === userId);
            return (
              <SelectedUserButton
                data-testid="selected-user-button"
                key={userId}
                c="brand.1"
                px="md"
                py="sm"
                maw="100%"
                rightIcon={<Icon name="close" />}
                onClick={() =>
                  setSelectedUserIds(without(selectedUserIds, userId))
                }
              >
                <Text align="left" w="100%" truncate c="inherit">
                  {user?.common_name}
                </Text>
              </SelectedUserButton>
            );
          })}
          <TextInput
            px="sm"
            variant="unstyled"
            size="md"
            placeholder={t`Search for users…`}
            value={userFilter}
            tabIndex={0}
            onChange={event => setUserFilter(event.currentTarget.value)}
            mt="-0.25rem"
          />
        </SearchUserSelectBox>
        {filteredUsers.length > 0 ? (
          <SearchUserPickerContent
            data-testid="search-user-list"
            h="100%"
            spacing="xs"
            p="xs"
          >
            {generateUserListElements(filteredUsers)}
          </SearchUserPickerContent>
        ) : (
          <Center py="md">
            <Text size="md" weight={700}>{t`No users found.`}</Text>
          </Center>
        )}
      </SearchUserPickerContainer>
    </SearchFilterPopoverWrapper>
  );
};
