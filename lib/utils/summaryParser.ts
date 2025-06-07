export function parseSummary(summary: string): Record<string, string> {
    if (!summary) {
        return {}
    }

    const result: Record<string, string> = {}
    let textToParse = summary

    // summary가 JSON 문자열인지 확인
    try {
        const parsedJson = JSON.parse(summary)
        if (typeof parsedJson === "object" && parsedJson !== null) {
            // JSON 객체인 경우, 모든 케이스를 일관되게 처리하기 위해 평면 텍스트 형식으로 변환
            // 값 중 하나가 여러 섹션을 포함하는 문자열인 경우도 처리
            let combinedText = ""
            for (const key in parsedJson) {
                if (Object.prototype.hasOwnProperty.call(parsedJson, key)) {
                    combinedText += `- ${key}: ${parsedJson[key]}\n`
                }
            }
            textToParse = combinedText
        }
    } catch (e) {
        // JSON 객체 문자열이 아닌 경우, 일반 텍스트 형식으로 간주
    }

    // 이스케이프된 개행문자와 일반 개행문자를 정규화
    textToParse = textToParse.replace(/\\n/g, "\n")

    // 섹션으로 분할. 각 섹션은 "- "로 시작
    const sections = textToParse.split(/\n- /g)

    for (let section of sections) {
        section = section.trim()
        // 첫 번째 섹션은 앞에 개행이 없어서 제대로 분할되지 않을 수 있음
        // 따라서 앞의 대시를 별도로 처리
        if (section.startsWith("- ")) {
            section = section.substring(2)
        }

        const separatorIndex = section.indexOf(":")
        if (separatorIndex > 0) {
            const key = section.substring(0, separatorIndex).trim()
            const value = section
                .substring(separatorIndex + 1)
                .trim()
                .replace(/\n/g, " ")
            if (key) {
                result[key] = value
            }
        }
    }

    return result
}
