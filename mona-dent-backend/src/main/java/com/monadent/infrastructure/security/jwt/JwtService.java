package com.monadent.infrastructure.security.jwt;

import com.monadent.application.port.JwtTokenProvider;
import com.monadent.domain.models.security.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService implements JwtTokenProvider {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpirationTime;

    @Override
    public String generateToken(CustomUserDetails userDetails) {
        return buildToken(userDetails, jwtExpirationTime);
    }

    public String extractUsername(final String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(final String token, final CustomUserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isExpired(token);
    }

    private boolean isExpired(final String token) {
        return extractTokenExpiration(token).before(new Date());
    }

    private Date extractTokenExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(final String token, final Function<Claims, T> claimResolver) {
        return claimResolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                   .verifyWith(getSigningKey())
                   .build()
                   .parseSignedClaims(token)
                   .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String buildToken(final CustomUserDetails userDetails, final long jwtExpirationTime) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId",
                   userDetails.getId()
                              .toString());
        claims.put("role", userDetails.getRole());

        return Jwts.builder()
                   .claims(claims)
                   .subject(userDetails.getUsername())
                   .issuedAt(new Date(System.currentTimeMillis()))
                   .expiration(new Date(System.currentTimeMillis() + jwtExpirationTime))
                   .signWith(getSigningKey())
                   .compact();
    }
}
