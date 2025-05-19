// 읽기용 유저 정보
export interface UserInfo {
  user_id?: number; //qna에서 userid를 확인하기 위해
  email: string;
  realname: string;
  nickname: string;
}

// 전송용 유저 정보
export interface UserForm extends UserInfo {
  password?: string;
}
