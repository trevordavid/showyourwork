// Imports
const core = require("@actions/core");
const artifact = require("@actions/artifact");
const shell = require("shelljs");
import {globby} from 'globby';

// Exports
module.exports = { uploadTemporaries };

/**
 * Upload build logs and temporaries for debugging.
 *
 */
async function uploadTemporaries() {

    // Maximum size of individual files; files bigger
    // than this will be skipped.
    const maxSizeInKB = 5000;

    // Assemble a list of folders/files in the root and src directories
    const patterns = [
      "*.*",
      "src/*.*"
    ];
    const all_files = await globby(patterns);

    // Remove large files
    const files = [];
    for (var i = 0; i < all_files.length; i++) {
      var f = all_files[i];
      var sz = parseInt(shell.exec(`du -k ${f} | cut -f1`, {silent:true}).stdout.replace('\n', ''));
      if (sz < maxSizeInKB) {
        files.push(f);
      }
    }
      
    // DEBUG
    core.info("<FILES>");
    core.info(files);
    core.info("</FILES>");

    // Upload the artifact
    const artifactClient = artifact.create();
    const uploadResponse = await artifactClient.uploadArtifact(
      "showyourwork-output", 
      files, 
      ".", 
      {
        continueOnError: true
      }
    );
   
}