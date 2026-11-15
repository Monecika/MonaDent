package com.monadent.shared;

public final class Ipv4AddressValidator {

    private Ipv4AddressValidator() {
    }

    public static boolean isValid(String address) {
        return normalize(address) != null;
    }

    /** Returns a canonical IPv4 address or network, or null for invalid input. */
    public static String normalize(String address) {
        if (address == null || address.isBlank()) return null;
        String value = address.trim();

        if (value.endsWith(".*")) {
            String prefix = value.substring(0, value.length() - 2);
            if (parseAddress(prefix + ".0") == null) return null;
            return prefix + ".0/24";
        }

        String[] parts = value.split("/", -1);
        if (parts.length > 2) return null;
        Long ip = parseAddress(parts[0]);
        if (ip == null) return null;
        if (parts.length == 1) return value;
        if (parts[1].isEmpty() || !parts[1].matches("\\d{1,2}")) return null;

        int prefix;
        try {
            prefix = Integer.parseInt(parts[1]);
        } catch (NumberFormatException exception) {
            return null;
        }
        if (prefix < 0 || prefix > 32) return null;

        long mask = prefix == 0 ? 0 : (0xffff_ffffL << (32 - prefix)) & 0xffff_ffffL;
        return formatAddress(ip & mask) + "/" + prefix;
    }

    public static boolean contains(String registeredRange, String candidateAddress) {
        String normalized = normalize(registeredRange);
        Long candidate = parseAddress(candidateAddress);
        if (normalized == null || candidate == null) return false;

        String[] parts = normalized.split("/", -1);
        if (parts.length == 1) return normalized.equals(candidateAddress);
        int prefix = Integer.parseInt(parts[1]);
        Long network = parseAddress(parts[0]);
        long mask = prefix == 0 ? 0 : (0xffff_ffffL << (32 - prefix)) & 0xffff_ffffL;
        return network != null && (candidate & mask) == network;
    }

    private static Long parseAddress(String address) {
        if (address == null) return null;
        String[] octets = address.split("\\.", -1);
        if (octets.length != 4) return null;

        long result = 0;
        for (String octet : octets) {
            if (octet.isEmpty() || octet.length() > 3
                    || (octet.length() > 1 && octet.charAt(0) == '0')) return null;
            for (int index = 0; index < octet.length(); index++) {
                if (octet.charAt(index) < '0' || octet.charAt(index) > '9') return null;
            }
            int value = Integer.parseInt(octet);
            if (value > 255) return null;
            result = (result << 8) | value;
        }
        return result;
    }

    private static String formatAddress(long address) {
        return ((address >>> 24) & 255) + "." + ((address >>> 16) & 255) + "."
                + ((address >>> 8) & 255) + "." + (address & 255);
    }
}
