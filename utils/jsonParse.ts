export default function jsonParse <T> (data: any): T {
    return JSON.parse(JSON.stringify(data));
}
