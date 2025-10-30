// Updated handleGoogleCallback method for your Spring Controller
// Replace the existing method in your GoogleLoginController.java

/**
 * Google 로그인 후 리다이렉트되는 엔드포인트
 * 인증 코드를 받아서 자동으로 로그인 처리 후 프론트엔드로 리다이렉트합니다.
 */
@GetMapping("/login/oauth2/code/google")
public RedirectView handleGoogleCallback(@RequestParam("code") String code) {
    try {
        GoogleLoginCommand command = GoogleLoginCommand.of(code);
        LoginResponse loginResponse = googleLoginUseCase.login(command);

        // 프론트엔드 콜백 URL에 로그인 정보를 쿼리 파라미터로 전달
        String frontendCallbackUrl = "http://localhost:3000/auth/callback?" +
            "message=" + java.net.URLEncoder.encode("로그인 성공!", "UTF-8") +
            "&role=" + loginResponse.getRole().toString() +
            "&userId=" + loginResponse.getUserId() +
            "&name=" + java.net.URLEncoder.encode(loginResponse.getName(), "UTF-8") +
            "&accessToken=" + loginResponse.getAccessToken();
        
        if (loginResponse.getTeamId() != null) {
            frontendCallbackUrl += "&teamId=" + loginResponse.getTeamId();
        }
        
        return new RedirectView(frontendCallbackUrl);
    } catch (Exception e) {
        String errorUrl = "http://localhost:3000/auth/callback?" +
            "error=" + java.net.URLEncoder.encode("로그인 실패", "UTF-8") +
            "&message=" + java.net.URLEncoder.encode(e.getMessage(), "UTF-8");
        return new RedirectView(errorUrl);
    }
}

// Also add this import at the top of your controller:
import java.net.URLEncoder;